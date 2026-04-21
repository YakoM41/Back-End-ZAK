// Importe la configuration de la base de données
const db = require("../db");

// Crée une nouvelle colonne dans la base de données
const createColumn = async (id_project, col_title, col_pos) => {
  let connection;
  try {
    // Obtient une connexion à partir du pool de connexions
    connection = await db.getConnection();
    // Démarre une transaction pour assurer l'intégrité des données
    await connection.beginTransaction();

    // Exécute la requête d'insertion pour une nouvelle colonne
    const [result] = await connection.execute(
      "INSERT INTO colonnes (id_project, col_title, col_pos) VALUES (?, ?, ?)",
      [id_project, col_title, col_pos],
    );

    // Récupère l'ID de la colonne nouvellement insérée
    const columnId = result.insertId;

    // Valide la transaction
    await connection.commit();
    return columnId;
  } catch (error) {
    // En cas d'erreur, annule la transaction
    if (connection) await connection.rollback();
    // Log l'erreur SQL détaillée
    console.error("ERREUR SQL DÉTAILLÉE DANS CREATECOLUMN:", error.message);
    // Propage l'erreur pour qu'elle soit gérée par le contrôleur
    throw error;
  } finally {
    // Libère la connexion pour qu'elle puisse être réutilisée
    if (connection) connection.release();
  }
};

// Récupère toutes les colonnes et leurs tâches associées pour un projet donné
const getColumnsByProjectId = async (id_project) => {
  // Requête SQL pour joindre les colonnes et les tâches
  const query = `
    SELECT
      col.id_col,
      col.col_title,
      col.col_pos,
      t.*
    FROM colonnes col
           LEFT JOIN taches t ON col.id_col = t.id_col
    WHERE col.id_project = ?
    ORDER BY col.col_pos ASC;
  `;

  // Exécute la requête avec l'ID du projet
  const [rows] = await db.query(query, [id_project]);

  // Si aucun résultat, retourne un tableau vide
  if (rows.length === 0) return [];

  // Objet pour regrouper les tâches par colonne
  const columns = {};

  // Itère sur chaque ligne de résultat
  rows.forEach((row) => {
    const { id_col, col_title, col_pos, ...taskDetails } = row;

    // Si la colonne n'existe pas encore dans notre objet, on l'initialise
    if (!columns[id_col]) {
      columns[id_col] = {
        id_col,
        col_title,
        col_pos,
        taches: [],
      };
    }

    // Si la ligne contient une tâche (id_tache n'est pas null), on l'ajoute au tableau des tâches de la colonne
    if (taskDetails.id_tache) {
      columns[id_col].taches.push({ ...taskDetails });
    }
  });

  // Retourne les valeurs de l'objet, ce qui nous donne un tableau de colonnes
  return Object.values(columns);
};

// Met à jour une colonne existante (titre ou position)
const updateColumn = async (id_col, fields) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Liste des champs autorisés à la mise à jour
    const allowed = ["col_title", "col_pos"];
    // Crée une chaîne de caractères pour la clause SET de la requête SQL
    const updates = Object.keys(fields)
      .filter((key) => allowed.includes(key))
      .map((key) => `${key} = ?`);

    // Si aucun champ valide n'est fourni, affiche une erreur
    if (updates.length === 0)
      throw new Error("Aucun champ valide à mettre à jour.");

    // Récupère les valeurs correspondantes aux champs à mettre à jour
    const values = Object.keys(fields)
      .filter((key) => allowed.includes(key))
      .map((key) => fields[key]);

    // Exécute la requête de mise à jour
    await connection.execute(
      `UPDATE colonnes SET ${updates.join(", ")} WHERE id_col = ?`,
      [...values, id_col],
    );

    await connection.commit();
    return true;
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("ERREUR SQL DÉTAILLÉE DANS UPDATECOLUMN:", error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// Supprime une colonne de la base de données
const deleteColumn = async (id_col) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Exécute la requête de suppression
    await connection.execute("DELETE FROM colonnes WHERE id_col = ?", [id_col]);

    await connection.commit();
    return true;
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("ERREUR SQL DÉTAILLÉE DANS DELETECOLUMN:", error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// Exporte les fonctions pour les rendre disponibles dans d'autres parties de l'application
module.exports = {
  createColumn,
  getColumnsByProjectId,
  updateColumn,
  deleteColumn,
};
