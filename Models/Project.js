const db = require("../db");

// Crée un nouveau projet dans la base de données
const createProject = async (project_name, project_desc) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.execute(
      "INSERT INTO projets (project_name, project_desc) VALUES (?, ?)",
      [project_name, project_desc],
    );

    const projectId = result.insertId;

    await connection.commit();
    return projectId;
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("ERREUR SQL DÉTAILLÉE DANS CREATEPROJECT:", error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// Récupère tous les projets
const getProjects = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM projets");
    return rows;
  } catch (error) {
    console.error("ERREUR SQL DÉTAILLÉE DANS GETPROJECTS:", error.message);
    throw error;
  }
};

// Récupère un projet par son ID
const getProjectById = async (id_project) => {
  try {
    const [rows] = await db.query("SELECT * FROM projets WHERE id_project = ?", [
      id_project,
    ]);
    return rows[0]; // Retourne le premier projet trouvé ou undefined
  } catch (error) {
    console.error("ERREUR SQL DÉTAILLÉE DANS GETPROJECTBYID:", error.message);
    throw error;
  }
};

// Met à jour un projet existant
const updateProject = async (id_project, fields) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const allowed = ["project_name", "project_desc"];
    const updates = Object.keys(fields)
      .filter((key) => allowed.includes(key))
      .map((key) => `${key} = ?`);

    if (updates.length === 0)
      throw new Error("Aucun champ valide à mettre à jour.");

    const values = Object.keys(fields)
      .filter((key) => allowed.includes(key))
      .map((key) => fields[key]);

    await connection.execute(
      `UPDATE projets SET ${updates.join(", ")} WHERE id_project = ?`,
      [...values, id_project],
    );

    await connection.commit();
    return true;
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("ERREUR SQL DÉTAILLÉE DANS UPDATEPROJECT:", error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// Supprime un projet
const deleteProject = async (id_project) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.execute("DELETE FROM projets WHERE id_project = ?", [
      id_project,
    ]);

    await connection.commit();
    return true;
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("ERREUR SQL DÉTAILLÉE DANS DELETEPROJECT:", error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
