
import bcrypt from "bcrypt";
import Share from "../models/Share.js";

// ==========================================
// CREATE SHARE
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

    // ==========================================
    // Allowed Share Types
    // ==========================================

    const allowedTypes = [
      "files",
      "text",
      "code",
      "link",
      "clipboard",
      "secret",
    ];

    // ==========================================
    // Validate Type
    // ==========================================

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid share type",
      });
    }

    // ==========================================
    // Validate Content
    // ==========================================

    if (
      type !== "files" &&
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    // ==========================================
    // Validate Password
    // ==========================================

    if (
      passwordProtected &&
      !password.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // ==========================================
    // Expiry
    // ==========================================

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

    // ==========================================
    // Generate Unique 6 Digit Code
    // ==========================================

    const shareCode =
      await generateUniqueCode();

    // ==========================================
    // Hash Password
    // ==========================================

    let hashedPassword = "";

    if (passwordProtected) {
      hashedPassword =
        await bcrypt.hash(password, 12);
    }

    // ==========================================
    // Create Share
    // ==========================================

    const share = await Share.create({
      shareCode,
      type,
      content,
      language,
      files,
      expiresAt,
      passwordProtected,

      // Never store plain password
      password: hashedPassword,

      burnAfterReading,

      creatorIp:
        req.ip ||
        req.headers["x-forwarded-for"] ||
        "",
    });

    // ==========================================
    // Response
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Share created successfully",

      share: {
        id: share._id,
        shareCode: share.shareCode,
        type: share.type,
        files: share.files,
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

    return res.status(500).json({
      success: false,
      message: "Failed to create share",
    });
  }
};

// ==========================================
// JOIN SHARE
// ==========================================

export const joinShare = async (req, res) => {
  try {
    const { shareCode } = req.body;

    // ==========================================
    // Validate Share Code
    // ==========================================

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

    // ==========================================
    // Find Share
    // ==========================================

    const share = await Share.findOne({
      shareCode,
    });

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Share not found",
      });
    }

    // ==========================================
    // Check Expiry
    // ==========================================

    if (new Date() > share.expiresAt) {
      return res.status(410).json({
        success: false,
        message: "This share has expired",
      });
    }

    // ==========================================
    // Check Burn After Reading
    // ==========================================

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

    // ==========================================
    // Password Protected
    // ==========================================

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

    // ==========================================
    // Mark Accessed
    // ==========================================

    share.accessed = true;
    share.accessCount += 1;

    await share.save();

    // ==========================================
    // Return Share
    // ==========================================

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

    return res.status(500).json({
      success: false,
      message: "Failed to access share",
    });
  }
};

// ==========================================
// VERIFY SHARE PASSWORD
// ==========================================

export const verifySharePassword = async (
  req,
  res
) => {
  try {
    const {
      shareCode,
      password,
    } = req.body;

    // ==========================================
    // Validate Share Code
    // ==========================================

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

    // ==========================================
    // Validate Password
    // ==========================================

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // ==========================================
    // Find Share
    // ==========================================

    const share = await Share.findOne({
      shareCode,
    });

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Share not found",
      });
    }

    // ==========================================
    // Check Expiry
    // ==========================================

    if (new Date() > share.expiresAt) {
      return res.status(410).json({
        success: false,
        message: "This share has expired",
      });
    }

    // ==========================================
    // Check Burn After Reading
    // ==========================================

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

    // ==========================================
    // Check Password Protection
    // ==========================================

    if (!share.passwordProtected) {
      return res.status(400).json({
        success: false,
        message:
          "This share does not require a password",
      });
    }

    // ==========================================
    // Compare Password
    // ==========================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        share.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // ==========================================
    // Mark Accessed
    // ==========================================

    share.accessed = true;
    share.accessCount += 1;

    await share.save();

    // ==========================================
    // Return Share Content
    // ==========================================

    return res.status(200).json({
      success: true,
      requiresPassword: false,

      message:
        "Password verified successfully",

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
      "Verify Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to verify password",
    });
  }
};

// ==========================================
// GENERATE UNIQUE 6 DIGIT CODE
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
