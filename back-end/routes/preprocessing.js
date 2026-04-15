const express = require("express");
const router = express.Router();
const {
  uploadImage,
  processBboxes,
  getStatus,
  downloadZip,
} = require("../controllers/preprocessingController");
const requireAuth = require("../middlewares/requireAuth");
const { logRequest } = require("../controllers/requestController");

// Appliquer uniquement l'authentification globalement
router.use(requireAuth);

/**
 * @route   POST /api/preprocessing/upload
 * @desc    Upload une image TIFF multi-particules et génère une version downscalée
 * @access  Private (authentification requise)
 * @body    {file} image - Fichier TIFF/PNG/JPEG (multipart/form-data)
 * @returns {sessionId, displayUrl, originalDimensions, displayDimensions, scaleRatio}
 */
router.post("/upload", uploadImage);

/**
 * @route   POST /api/preprocessing/process
 * @desc    Traite les bounding boxes et extrait les particules
 * @access  Private (authentification requise)
 * @body    {sessionId, bboxes: [{id, x, y, width, height}], marginPx}
 * @returns {status, progress, particlesCount, message}
 */
router.post("/process", processBboxes);

/**
 * @route   GET /api/preprocessing/status/:sessionId
 * @desc    Récupère le statut du traitement en cours
 * @access  Private (authentification requise)
 * @params  sessionId - Identifiant de la session
 * @returns {status, progress, processedCount, zipUrl, error}
 */
router.get("/status/:sessionId", getStatus);

/**
 * @route   GET /api/preprocessing/download/:sessionId
 * @desc    Télécharge le fichier ZIP des particules extraites
 * @access  Private (authentification requise)
 * @params  sessionId - Identifiant de la session
 * @returns ZIP file stream
 */
router.get("/download/:sessionId", downloadZip);

module.exports = router;
