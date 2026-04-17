// Permet de config le pool de connexion à MySQL
// Pour faire des requêtes asynchrones/await

const mysql = require("mysql2/promise");
require("dotenv").config();

// Pool de connexion qui permet de gérer plusieurs connexions simultanées, réutiliser des connexions existantes
// Permet aussi une gestion auto de la disponibilité et limiter le nb de connexions (en même temps)
const db = mysql.createPool({
  // PARAMÈTRES DE CONNEXION (host, nom utilisateur, MdP, nom de la BDD)
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // PARAMÈTRES DU POOL
  // 1. Si plus de connexion dispo, alors elles attendent
  waitForConnections: true,
  // 2. Limiter le nb max de connexions
  connectionLimit: 10,

  // PARAMÈTRES OPTIONNELS (mais recommandés)
  // 1. Nouvelle tentative en cas d'échec de connexion
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // 2. Timeout de connexion (milliseconde)
  connectTimeout: 10000, //10sec
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connecté à la base de données MySQL");

    // Se déconnecte
    connection.release();
  } catch (err) {
    console.error("Erreur de connexion à MySQL : ", err.message);
    // Arrete l'application avec un code erreur
    process.exit(1);
  }
})();

module.exports = db;
