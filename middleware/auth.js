////validacion

const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token no proporcionado o malformado" });
  }
  //[Bearer, jkdhjfkhjjdhfjhskdhjhskdhfkjshfjhkjhjk]  como un arreglo
  const Token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(Token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    let message = "Token invalido";
    console.error("Error al verificar el token", error, message);
    if (error.name === "TokenExpiredError") message = "Token expirado";
    res.status(400).json({ error: message });
  }
};
module.exports = auth;
