//MODEL USER
const db = require("../db");
const bcrypt = require("bcryptjs");

// Rechercher un utilisateur par son ID
const findUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM utilisateurs WHERE id_user = ?",
    [id],
  );
  return rows;
};

//RECHERCHER UN utilisateur PAR EMAIL
const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM utilisateurs WHERE user_email = ?",
    [email],
  );
  return rows;
};

//CRÉER UN NOUVEL utilisateur
const createUser = async (userData) => {
  const { Nom, Prenom, email, Mot_de_passe } = userData;

  const [result] = await db.query(
    "INSERT INTO utilisateurs (user_name, user_first_name, user_email, user_password) VALUES (?,?,?,?)",
    [Nom, Prenom, email, Mot_de_passe],
  );
  return result;
};

//HASHAGE DE MDP

const hashPassword = async (password) => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || 10);
  return await bcrypt.hash(password, rounds);
};

//Comparer un MDP
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
module.exports = {
  findUserByEmail,
  createUser,
  hashPassword,
  comparePassword,
  findUserById,
};
