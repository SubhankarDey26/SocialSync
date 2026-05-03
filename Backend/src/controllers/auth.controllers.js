const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function registerController(req, res) {
  try {
    const { email, username, password, bio } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      const field =
        isUserAlreadyExists.email === email ? "Email" : "Username";
      return res.status(409).json({
        message: `${field} already exists`,
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      bio,
      password: hash,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: user.email,
        username: user.username,
        // Use ProfileImage (capital P — matches the model field name)
        profileImage: user.ProfileImage,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Username or email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logincontroller(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ username: username || "" }, { email: email || "" }],
      })
      .select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        email: user.email,
        username: user.username,
        // Use ProfileImage (capital P — matches the model field name)
        profileImage: user.ProfileImage,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getMeController(req, res) {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.ProfileImage,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutController(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
  registerController,
  logincontroller,
  getMeController,
  logoutController,
};