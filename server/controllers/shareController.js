import Share from "../models/Share.js";

// ==========================================
// Create Share
// ==========================================

export const createShare = async (req, res) => {
  try {
    const {
      type,
      content = "",
      language = "",
      files = [],
      expiry = "10m",
      passwordProtected = false,
      password = "",
      burnAfterReading = false,
    } = req.body;

    // ================= Validation =================

    const allowedTypes = [
      "files",
      "text",
      "code",
      "link",
      "clipboard",
      "secret",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid share type",
      });
    }

    if (
      type !== "files" &&
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    if (
      passwordProtected &&
      !password.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // ================= Expiry =================

    const expiryMap = {
      "5m": 5 * 60 * 1000,
      "10m": 10 * 60 * 1000,
      "30m": 30 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
    };

    if (!expiryMap[expiry]) {
      return res.status(400).json({
        success: false,
        message: "Invalid expiry option",
      });
    }

    const expiresAt = new Date(
      Date.now() + expiryMap[expiry]
    );

    // ================= Generate Code =================

    const shareCode =
      await generateUniqueCode();

    // ================= Create Share =================

    const share = await Share.create({
      shareCode,
      type,
      content,
      language,
      files,
      expiresAt,
      passwordProtected,
      password: passwordProtected
        ? password
        : "",
      burnAfterReading,
      creatorIp:
        req.ip ||
        req.headers["x-forwarded-for"] ||
        "",
    });

    // ================= Response =================

    res.status(201).json({
      success: true,
      message: "Share created successfully",

      share: {
        id: share._id,
        shareCode: share.shareCode,
        type: share.type,
        expiresAt: share.expiresAt,
        passwordProtected:
          share.passwordProtected,
        burnAfterReading:
          share.burnAfterReading,
      },
    });
  } catch (error) {
    console.error(
      "Create Share Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create share",
    });
  }
};

// ==========================================
// Join Share
// ==========================================

export const joinShare = async (req, res) => {
  try {
    const { shareCode } = req.body;

    // ================= Validate Code =================

    if (!shareCode) {
      return res.status(400).json({
        success: false,
        message: "Share code is required",
      });
    }

    if (!/^\d{6}$/.test(shareCode)) {
      return res.status(400).json({
        success: false,
        message:
          "Share code must contain exactly 6 digits",
      });
    }

    // ================= Find Share =================

    const share = await Share.findOne({
      shareCode,
    });

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Share not found",
      });
    }

    // ================= Check Expiry =================

    if (new Date() > share.expiresAt) {
      return res.status(410).json({
        success: false,
        message: "This share has expired",
      });
    }

    // ================= Burn After Reading =================

    if (
      share.burnAfterReading &&
      share.accessed
    ) {
      return res.status(410).json({
        success: false,
        message:
          "This share has already been accessed",
      });
    }

    // ================= Password =================

    if (share.passwordProtected) {
      return res.status(200).json({
        success: true,
        requiresPassword: true,
        message:
          "Password required to access this share",
        share: {
          shareCode: share.shareCode,
          type: share.type,
          expiresAt: share.expiresAt,
        },
      });
    }

    // ================= Access Share =================

    share.accessed = true;
    share.accessCount += 1;

    await share.save();

    // ================= Response =================

    return res.status(200).json({
      success: true,
      requiresPassword: false,

      share: {
        id: share._id,
        shareCode: share.shareCode,
        type: share.type,
        content: share.content,
        language: share.language,
        files: share.files,
        expiresAt: share.expiresAt,
        burnAfterReading:
          share.burnAfterReading,
        accessCount:
          share.accessCount,
      },
    });
  } catch (error) {
    console.error(
      "Join Share Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to access share",
    });
  }
};

// ==========================================
// Generate Unique 6 Digit Code
// ==========================================

async function generateUniqueCode() {
  let code;
  let existingShare;

  do {
    code = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    existingShare =
      await Share.findOne({
        shareCode: code,
      });
  } while (existingShare);

  return code;
}