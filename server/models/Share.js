import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    // ================= Share Code =================

    shareCode: {
      type: String,
      required: true,
      unique: true,
      length: 6,
      index: true,
    },

    // ================= Share Type =================

    type: {
      type: String,
      required: true,
      enum: [
        "files",
        "text",
        "code",
        "link",
        "clipboard",
        "secret",
      ],
    },

    // ================= Content =================

    content: {
      type: String,
      default: "",
    },

    // ================= Code Language =================

    language: {
      type: String,
      default: "",
    },

    // ================= Files =================

    files: [
      {
        name: {
          type: String,
        },

        originalName: {
          type: String,
        },

        url: {
          type: String,
        },

        size: {
          type: Number,
          default: 0,
        },

        mimeType: {
          type: String,
        },
      },
    ],

    // ================= Password =================

    passwordProtected: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      default: "",
    },

    // ================= Expiry =================

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    // ================= Burn After Reading =================

    burnAfterReading: {
      type: Boolean,
      default: false,
    },

    // ================= Access =================

    accessed: {
      type: Boolean,
      default: false,
    },

    accessCount: {
      type: Number,
      default: 0,
    },

    // ================= Creator =================

    creatorIp: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete expired shares
shareSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Share = mongoose.model(
  "Share",
  shareSchema
);

export default Share;