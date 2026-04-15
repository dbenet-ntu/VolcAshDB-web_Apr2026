const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Schéma pour les sessions de pré-traitement d'images.
 * Utilisé pour tracker l'état du workflow de sélection de bounding boxes
 * et d'extraction de particules.
 */
const preprocessingSessionSchema = new Schema(
  {
    // Identifiant unique de la session
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Email de l'utilisateur propriétaire
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // Statut actuel de la session
    status: {
      type: String,
      enum: ["idle", "uploaded", "processing", "completed", "error"],
      default: "idle",
      required: true,
    },

    // Informations sur l'image originale uploadée
    originalImage: {
      filename: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
    },

    // Informations sur l'image downscalée pour affichage web
    displayImage: {
      path: {
        type: String,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      scaleRatio: {
        type: Number,
        required: true,
        default: 1.0,
      },
    },

    // Liste des bounding boxes sélectionnées par l'utilisateur
    // Coordonnées en pixels sur l'image DISPLAY (pas l'originale)
    bboxes: [
      {
        id: {
          type: String,
          required: true,
        },
        x: {
          type: Number,
          required: true,
        },
        y: {
          type: Number,
          required: true,
        },
        width: {
          type: Number,
          required: true,
        },
        height: {
          type: Number,
          required: true,
        },
      },
    ],

    // Chemin vers le fichier ZIP des particules extraites
    zipPath: {
      type: String,
      default: null,
    },

    // Message d'erreur en cas de problème
    errorMessage: {
      type: String,
      default: null,
    },

    // Progression du traitement (0-100)
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Nombre de particules traitées avec succès
    processedCount: {
      type: Number,
      default: 0,
    },

    // Timestamp de la dernière activité (pour cleanup automatique)
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

// Index pour accélérer les requêtes de cleanup
preprocessingSessionSchema.index({ lastActivity: 1 });
preprocessingSessionSchema.index({ status: 1, lastActivity: 1 });

// Méthode pour mettre à jour la dernière activité
preprocessingSessionSchema.methods.updateActivity = function () {
  this.lastActivity = Date.now();
  return this.save();
};

// Méthode pour mettre à jour le statut
preprocessingSessionSchema.methods.updateStatus = function (status, errorMessage = null) {
  this.status = status;
  if (errorMessage) {
    this.errorMessage = errorMessage;
  }
  this.lastActivity = Date.now();
  return this.save();
};

// Méthode pour mettre à jour la progression
preprocessingSessionSchema.methods.updateProgress = function (progress, processedCount = null) {
  this.progress = Math.min(100, Math.max(0, progress));
  if (processedCount !== null) {
    this.processedCount = processedCount;
  }
  this.lastActivity = Date.now();
  return this.save();
};

module.exports = mongoose.model("PreprocessingSession", preprocessingSessionSchema);
