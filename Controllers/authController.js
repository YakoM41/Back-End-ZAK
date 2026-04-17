// INSCRIPTION
const {
  hashPassword,
  comparePassword,
  findUserById,
  findUserByEmail,
  createUser,
} = require("../Models/User");

const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { Nom, Prenom, email, Mot_de_passe } = req.body;

    // Verifier si l'Email existe déjà
    const existingUser = await findUserByEmail(email);
    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Erreur : Cet Email est déjà utilisé",
      });
    }

    // Hashage du MDP
    const hash = await hashPassword(Mot_de_passe);

    // Créer le client
    const result = await createUser({
      Nom,
      Prenom,
      email,
      Mot_de_passe: hash,
    });

    res.status(201).json({
      message: "Votre inscription a bien été validé ",
      client_id: result.insertId,
      user: { Nom, Prenom, email },
    });
  } catch (error) {
    console.error("Erreur inscription", error.message);
    res.status(500).json({
      message: "Erreur lors de l'inscription",
    });
  }
};

// Connexion

const login = async (req, res) => {
  try {
    const { email, Mot_de_passe } = req.body;

    // Rechercher le client

    const users = await findUserByEmail(email);
    if (users.length === 0) {
      return res.status(401).json({
        message: "Identifiants incorrects",
      });
    }

    const user = users[0];

    // Vérifier le MDP

    const isMatch = await comparePassword(Mot_de_passe, user.user_password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Identifiants incorrects",
      });
    }

    // GÉNÉRER LE TOKEN JWT
    // Expire en secondes
    const expireValeur = process.env.JWT_EXPIRES_IN || "3600";
    const expire = parseInt(expireValeur, 10);
    const token = jwt.sign(
      { id: user.id_user, email: user.user_email },
      process.env.JWT_SECRET,
      { expiresIn: expire },
    );

    // On place le token dans un cookie HttpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // mettre sur vrai pour mise en ligne
      sameSite: "none",
      maxAge: expire * 1000,
    });
    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id_user,
        nom: user.user_name,
        prenom: user.user_first_name,
        email: user.user_email,
      },
    });
  } catch (error) {
    console.error("Erreur de connexion utilisateur", error.message);
    res.status(500).json({
      message: "Erreur lors de la connexion",
    });
  }
};

// Fonction qui permet le logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // mettre sur vrai en Https (c'est a dire en ligne)
    sameSite: "none",
  });
  res.json({ message: "Déconnexion réussie" });
};

// Automatiquement le navigateur envoie le cookie
// Le middleware verifie le JWT
// SI le token EST valide, On retourne les infos de l'utilisateur
const getMe = async (req, res) => {
  try {
    // req.user.id vient du JWT decode par le middleware verifyToken
    const users = await findUserById(req.user.id);

    if (users.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const user = users[0];

    res.json({
      user: {
        id: user.id_user,
        nom: user.user_name,
        prenom: user.user_first_name,
        email: user.user_email,
      },
    });
  } catch (error) {
    console.error("Erreur /me:", error.message);
    res
      .status(500)
      .json({ message: "Erreur lors de la vérification de session" });
  }
};

module.exports = { register, login, logout, getMe };
