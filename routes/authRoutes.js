const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const validator = require("validator");
const auth = require("../middleware/auth");

const router = express.Router();

//Ruta registrar un usuario
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Correo invalido" });
    }
    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

//Ruta de login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario o encontrado" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Contraseña incorrecta" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Ruta para verificar token
router.get("/verify", auth, (req, res) => {
  res.status(200).json({ message: "Token válido", user: req.user });
});

module.exports = router;
