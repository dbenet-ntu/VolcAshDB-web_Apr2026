const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const fsSync = require("fs");
const sharp = require("sharp");
const axios = require("axios");
const AdmZip = require("adm-zip");
const crypto = require("crypto");
const PreprocessingSession = require("../models/preprocessingSession");

// Fonction pour générer des UUIDs
const uuidv4 = () => crypto.randomUUID();

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Créer un dossier temporaire unique pour cette session
    const sessionId = uuidv4();
    const uploadPath = path.join(__dirname, "../uploads/preprocessing", sessionId);

    // Stocker le sessionId dans req pour l'utiliser dans le controller
    req.sessionId = sessionId;

    // Créer le dossier de manière synchrone
    fsSync.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Garder le nom original pour référence
    cb(null, "original_" + file.originalname);
  },
});

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".tif", ".tiff", ".png", ".jpg", ".jpeg"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Format de fichier non supporté. Formats acceptés: ${allowedExtensions.join(", ")}`
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024 * 1024, // 3 GB max (to support 2.4 GB test file)
  },
}).single("image");

/**
 * Upload une image et génère une version downscalée pour l'affichage web
 * @route POST /api/preprocessing/upload
 */
const uploadImage = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "Fichier trop volumineux. Taille maximale: 3 GB",
        });
      }
      return res.status(400).json({ error: `Erreur upload: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    try {
      const sessionId = req.sessionId;
      // Gérer le cas où req.user n'est pas défini (problème d'authentification)
      const userId = req.user?.email || 'anonymous';
      const originalPath = req.file.path;
      const originalFilename = req.file.originalname;
      const sessionDir = path.dirname(originalPath);

      console.log(`[Preprocessing] Session ${sessionId}: Upload de ${originalFilename} par ${userId}`);

      // 1. Obtenir les dimensions de l'image originale
      // Note: Augmenter la limite de pixels pour les grandes images TIFF (2.4 GB+)
      // Par défaut Sharp limite à 268 megapixels, on met 0 pour désactiver
      const metadata = await sharp(originalPath, {
        limitInputPixels: 0  // 0 = pas de limite de pixels
      }).metadata();
      const originalWidth = metadata.width;
      const originalHeight = metadata.height;

      console.log(`[Preprocessing] Image originale: ${originalWidth}x${originalHeight}px`);

      // 2. Calculer les dimensions pour le downscale (max 1600px sur le côté le plus long)
      const maxDisplaySize = 1600;
      let displayWidth, displayHeight, scaleRatio;

      if (originalWidth > originalHeight) {
        if (originalWidth > maxDisplaySize) {
          displayWidth = maxDisplaySize;
          displayHeight = Math.round((originalHeight * maxDisplaySize) / originalWidth);
          scaleRatio = originalWidth / displayWidth;
        } else {
          displayWidth = originalWidth;
          displayHeight = originalHeight;
          scaleRatio = 1.0;
        }
      } else {
        if (originalHeight > maxDisplaySize) {
          displayHeight = maxDisplaySize;
          displayWidth = Math.round((originalWidth * maxDisplaySize) / originalHeight);
          scaleRatio = originalHeight / displayHeight;
        } else {
          displayWidth = originalWidth;
          displayHeight = originalHeight;
          scaleRatio = 1.0;
        }
      }

      console.log(
        `[Preprocessing] Image display: ${displayWidth}x${displayHeight}px (ratio: ${scaleRatio.toFixed(2)})`
      );

      // 3. Générer l'image downscalée en PNG pour l'affichage web
      const displayPath = path.join(sessionDir, "display.png");
      await sharp(originalPath, {
        limitInputPixels: 0  // 0 = pas de limite de pixels
      })
        .resize(displayWidth, displayHeight, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .png()
        .toFile(displayPath);

      console.log(`[Preprocessing] Image display créée: ${displayPath}`);

      // 4. Créer la session dans MongoDB
      const session = new PreprocessingSession({
        sessionId: sessionId,
        userId: userId,
        status: "uploaded",
        originalImage: {
          filename: originalFilename,
          path: originalPath,
          width: originalWidth,
          height: originalHeight,
        },
        displayImage: {
          path: displayPath,
          width: displayWidth,
          height: displayHeight,
          scaleRatio: scaleRatio,
        },
        bboxes: [],
        lastActivity: new Date(),
      });

      await session.save();

      console.log(`[Preprocessing] Session ${sessionId} créée en DB`);

      // 5. Retourner les informations au client
      res.status(200).json({
        sessionId: sessionId,
        displayUrl: `/uploads/preprocessing/${sessionId}/display.png`,
        originalDimensions: {
          width: originalWidth,
          height: originalHeight,
        },
        displayDimensions: {
          width: displayWidth,
          height: displayHeight,
        },
        scaleRatio: scaleRatio,
        message: "Image uploadée avec succès",
      });
    } catch (error) {
      console.error("[Preprocessing] Erreur lors de l'upload:", error);
      
      // Nettoyer les fichiers en cas d'erreur
      if (req.sessionId) {
        const sessionDir = path.join(__dirname, "../uploads/preprocessing", req.sessionId);
        try {
          await fs.rm(sessionDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.error("[Preprocessing] Erreur nettoyage:", cleanupError);
        }
      }

      res.status(500).json({
        error: "Erreur lors du traitement de l'image",
        details: error.message,
      });
    }
  });
};

/**
 * Traite les bounding boxes et extrait les particules
 * @route POST /api/preprocessing/process
 */
const processBboxes = async (req, res) => {
  try {
    const { sessionId, bboxes, marginPx = 10 } = req.body;
    const userId = req.user?.email || 'anonymous';

    // Validation des paramètres
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId requis" });
    }

    if (!bboxes || !Array.isArray(bboxes) || bboxes.length === 0) {
      return res.status(400).json({
        error: "Liste de bounding boxes requise et non vide",
      });
    }

    console.log(
      `[Preprocessing] Session ${sessionId}: Traitement de ${bboxes.length} bbox par ${userId}`
    );

    // Récupérer la session depuis MongoDB
    const session = await PreprocessingSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session non trouvée" });
    }

    // Vérifier que c'est bien l'utilisateur propriétaire (sauf si mode anonymous pour tests)
    if (session.userId !== userId && session.userId !== 'anonymous' && userId !== 'anonymous') {
      return res.status(403).json({ error: "Accès non autorisé à cette session" });
    }

    // Vérifier le statut
    if (session.status === "processing") {
      return res.status(409).json({
        error: "Traitement déjà en cours pour cette session",
      });
    }

    // Mettre à jour le statut et les bboxes
    session.bboxes = bboxes;
    await session.updateStatus("processing");

    console.log(`[Preprocessing] Démarrage du traitement (scaleRatio: ${session.displayImage.scaleRatio})`);

    // Lancer le traitement en arrière-plan (ne pas bloquer la réponse)
    processParticlesAsync(session, marginPx).catch((error) => {
      console.error(`[Preprocessing] Erreur traitement async session ${sessionId}:`, error);
    });

    // Répondre immédiatement au client
    res.status(202).json({
      message: "Traitement démarré",
      sessionId: sessionId,
      particlesCount: bboxes.length,
      status: "processing",
    });
  } catch (error) {
    console.error("[Preprocessing] Erreur dans processBboxes:", error);
    res.status(500).json({
      error: "Erreur lors du démarrage du traitement",
      details: error.message,
    });
  }
};

/**
 * Fonction async pour traiter les particules en arrière-plan
 */
const processParticlesAsync = async (session, marginPx) => {
  const sessionId = session.sessionId;
  const sessionDir = path.dirname(session.originalImage.path);
  const particlesDir = path.join(sessionDir, "particles");
  const scaleRatio = session.displayImage.scaleRatio;

  try {
    // Créer le dossier pour les particules extraites
    await fs.mkdir(particlesDir, { recursive: true });

    const totalBboxes = session.bboxes.length;
    let processedCount = 0;

    console.log(`[Preprocessing] Extraction de ${totalBboxes} particules...`);

    // URL de l'endpoint Flask du volcashclassifier
    const flaskUrl = process.env.FLASK_API_URL || "http://localhost:5003";
    const preprocessEndpoint = `${flaskUrl}/preprocess_particle`;

    // Traiter chaque bbox
    for (let i = 0; i < session.bboxes.length; i++) {
      const bbox = session.bboxes[i];

      try {
        console.log(`[Preprocessing] Traitement bbox ${i + 1}/${totalBboxes} (${bbox.id})`);

        // Recalibrer la bbox sur l'image originale
        const originalBbox = {
          x: Math.round(bbox.x * scaleRatio),
          y: Math.round(bbox.y * scaleRatio),
          width: Math.round(bbox.width * scaleRatio),
          height: Math.round(bbox.height * scaleRatio),
        };

        console.log(
          `[Preprocessing] Bbox display: (${bbox.x}, ${bbox.y}, ${bbox.width}x${bbox.height})`
        );
        console.log(
          `[Preprocessing] Bbox original: (${originalBbox.x}, ${originalBbox.y}, ${originalBbox.width}x${originalBbox.height})`
        );

        // 1. D'abord cropper l'image avec Sharp (évite d'envoyer 2.4 GB à Flask)
        const croppedImageBuffer = await sharp(session.originalImage.path, {
          limitInputPixels: 0
        })
          .extract({
            left: Math.max(0, originalBbox.x - marginPx),
            top: Math.max(0, originalBbox.y - marginPx),
            width: Math.min(session.originalImage.width, originalBbox.width + 2 * marginPx),
            height: Math.min(session.originalImage.height, originalBbox.height + 2 * marginPx),
          })
          .png()
          .toBuffer();

        console.log(`[Preprocessing] Crop créé: ${croppedImageBuffer.length} bytes`);

        // 2. Envoyer seulement le crop à Flask pour RemBG
        const FormData = require("form-data");
        const form = new FormData();

        form.append("image_file", croppedImageBuffer, {
          filename: `crop_${bbox.id}.png`,
          contentType: "image/png",
        });

        // Flask n'a plus besoin de la bbox ni de margin_px car l'image est déjà croppée
        // On envoie une bbox qui couvre toute l'image croppée
        const fullImageBbox = {
          x: 0,
          y: 0,
          width: originalBbox.width + 2 * marginPx,
          height: originalBbox.height + 2 * marginPx,
        };
        form.append("bbox", JSON.stringify(fullImageBbox));
        form.append("margin_px", "0"); // Pas de marge supplémentaire

        // Appeler l'endpoint Flask
        const response = await axios.post(preprocessEndpoint, form, {
          headers: form.getHeaders(),
          responseType: "arraybuffer",
          timeout: 60000, // 60 secondes timeout
        });

        // Sauvegarder la particule extraite
        const particleFilename = `particle_${String(i + 1).padStart(3, "0")}_${bbox.id}.png`;
        const particlePath = path.join(particlesDir, particleFilename);
        await fs.writeFile(particlePath, response.data);

        processedCount++;

        // Mettre à jour la progression
        const progress = Math.round((processedCount / totalBboxes) * 100);
        await session.updateProgress(progress, processedCount);

        console.log(
          `[Preprocessing] Particule ${processedCount}/${totalBboxes} sauvegardée: ${particleFilename}`
        );
      } catch (error) {
        console.error(`[Preprocessing] Erreur bbox ${bbox.id}:`, error.message);
        // Continuer avec les autres bboxes même en cas d'erreur
      }
    }

    // Créer le fichier ZIP avec toutes les particules
    console.log(`[Preprocessing] Création du ZIP avec ${processedCount} particules...`);

    const zip = new AdmZip();
    const particleFiles = await fs.readdir(particlesDir);

    for (const file of particleFiles) {
      if (file.endsWith(".png")) {
        const filePath = path.join(particlesDir, file);
        zip.addLocalFile(filePath);
      }
    }

    const zipPath = path.join(sessionDir, "particles.zip");
    zip.writeZip(zipPath);

    console.log(`[Preprocessing] ZIP créé: ${zipPath}`);

    // Mettre à jour la session
    session.zipPath = zipPath;
    session.progress = 100;
    session.processedCount = processedCount;
    await session.updateStatus("completed");

    console.log(`[Preprocessing] Session ${sessionId} terminée avec succès (${processedCount}/${totalBboxes} particules)`);
  } catch (error) {
    console.error(`[Preprocessing] Erreur fatale session ${sessionId}:`, error);
    await session.updateStatus("error", error.message);
  }
};

/**
 * Récupère le statut d'une session de traitement
 * @route GET /api/preprocessing/status/:sessionId
 */
const getStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.email || 'anonymous';

    const session = await PreprocessingSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session non trouvée" });
    }

    // Vérifier que c'est bien l'utilisateur propriétaire (sauf si mode anonymous pour tests)
    if (session.userId !== userId && session.userId !== 'anonymous' && userId !== 'anonymous') {
      return res.status(403).json({ error: "Accès non autorisé à cette session" });
    }

    // Mettre à jour lastActivity
    await session.updateActivity();

    // Retourner le statut
    const response = {
      sessionId: session.sessionId,
      status: session.status,
      progress: session.progress,
      processedCount: session.processedCount,
      totalCount: session.bboxes.length,
    };

    if (session.status === "completed" && session.zipPath) {
      response.zipUrl = `/api/preprocessing/download/${sessionId}`;
    }

    if (session.status === "error") {
      response.error = session.errorMessage;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("[Preprocessing] Erreur getStatus:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération du statut",
      details: error.message,
    });
  }
};

/**
 * Télécharge le fichier ZIP des particules extraites
 * @route GET /api/preprocessing/download/:sessionId
 */
const downloadZip = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.email || 'anonymous';

    const session = await PreprocessingSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session non trouvée" });
    }

    // Vérifier que c'est bien l'utilisateur propriétaire (sauf si mode anonymous pour tests)
    if (session.userId !== userId && session.userId !== 'anonymous' && userId !== 'anonymous') {
      return res.status(403).json({ error: "Accès non autorisé à cette session" });
    }

    // Vérifier que le traitement est terminé
    if (session.status !== "completed") {
      return res.status(400).json({
        error: "Le traitement n'est pas encore terminé",
        status: session.status,
      });
    }

    // Vérifier que le fichier ZIP existe
    if (!session.zipPath || !fsSync.existsSync(session.zipPath)) {
      return res.status(404).json({ error: "Fichier ZIP non trouvé" });
    }

    console.log(`[Preprocessing] Téléchargement ZIP session ${sessionId} par ${userId}`);

    // Mettre à jour lastActivity
    await session.updateActivity();

    // Envoyer le fichier ZIP
    const filename = `volcashdb_particles_${sessionId.substring(0, 8)}.zip`;
    const sessionDir = path.dirname(session.zipPath);
    
    res.download(session.zipPath, filename, async (err) => {
      if (err) {
        console.error("[Preprocessing] Erreur download:", err);
        if (!res.headersSent) {
          res.status(500).json({
            error: "Erreur lors du téléchargement",
            details: err.message,
          });
        }
      } else {
        // Téléchargement réussi, supprimer le dossier et la session
        try {
          console.log(`[Preprocessing] Suppression du dossier session ${sessionId}`);
          await fs.rm(sessionDir, { recursive: true, force: true });
          
          // Supprimer également l'entrée MongoDB
          await PreprocessingSession.deleteOne({ sessionId });
          
          console.log(`[Preprocessing] Session ${sessionId} nettoyée avec succès`);
        } catch (cleanupError) {
          console.error(`[Preprocessing] Erreur nettoyage session ${sessionId}:`, cleanupError);
          // Ne pas renvoyer d'erreur au client car le téléchargement a réussi
        }
      }
    });
  } catch (error) {
    console.error("[Preprocessing] Erreur downloadZip:", error);
    res.status(500).json({
      error: "Erreur lors du téléchargement",
      details: error.message,
    });
  }
};

module.exports = {
  uploadImage,
  processBboxes,
  getStatus,
  downloadZip,
};
