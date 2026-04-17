//Middleware d'authenfication JWT - authMiddleware.js
//Vérifie que le token JWT est valide pour proteger les routes
const jwt = require("jsonwebtoken");
const { isProjectManager } = require("../Models/Role");

const verifyToken = (req, res, next) => {
  // Cherche le token dans le cookie HttpOnly
  let token = req.cookies && req.cookies.token;

  // header Authorization
  if (!token) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(403).json({ message: "Token manquant" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(403).json({ message: "Format de token invalide" });
    }

    token = parts[1];
  }

  //Verifier le token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expiré",
        });
      }
      return res.status(401).json({
        message: "Token invalide",
      });
    }

    //Token valide : on ajoute les infos de l'utilisateur à la requête

    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
