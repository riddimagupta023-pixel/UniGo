const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const resend = new Resend(process.env.RESEND_API_KEY);

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const { name, email, password, course } = req.body || {};

    if (!name || !email || !password || !course) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      course,
      role: "student",
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error during registration",
    });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error during login",
    });
  }
});

// PROTECTED TEST ROUTE
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Protected route accessed successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// GET ALL USERS - ADMIN ONLY
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);

      res.status(500).json({
        message: "Unable to fetch users",
      });
    }
  }
);
// Change password
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please enter your email address",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Do not reveal whether an email exists
    if (!user) {
      return res.json({
        message:
          "If an account exists with this email, a password reset link will be sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store token and expiry time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    // Create reset link
    const resetLink = `https://uni-go-seven.vercel.app/reset-password?token=${resetToken}`;

    // Send reset email
    await resend.emails.send({
  from: "UniGo <onboarding@resend.dev>",
  to: user.email,
  subject: "UniGo - Password Reset",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #4f46e5;">UniGo - Password Reset</h2>

      <p>Hello ${user.name},</p>

      <p>
        We received a request to reset your UniGo account password.
      </p>

      <p>
        Click the button below to create a new password:
      </p>

      <p>
        <a
          href="${resetLink}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>
      </p>

      <p>
        This link will expire in <strong>15 minutes</strong>.
      </p>

      <p>
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <p>
        Regards,<br />
        UniGo Team
      </p>
    </div>
  `,
});

    res.json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Unable to send password reset email",
    });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Reset token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    // Remove the token after successful reset
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;