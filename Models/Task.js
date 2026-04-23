// MODEL TACHES
const db = require("../db");

// fonction pour créer une tâche
const createTask = async (taskData) => {
  const {
    title,
    description,
    pos,
    due_date,
    planned,
    reel,
    col_id,
    project_id,
  } = taskData;

  const [result] = await db.query(
    "INSERT INTO taches (task_title, task_desc, task_pos, task_due_date, planned_time, reel_time, id_col, id_project) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [title, description, pos, due_date, planned, reel, col_id, project_id],
  );

  return result; // On retourne l'objet de la tâche qui vient d'être créée
};

// fonction qui permet de mettre à jour une tâche
const updateTask = async (idData, taskData) => {
  const fields = [];
  const values = [];
  // Mappage entre les clés de l'objet idData et les colonnes de la BDD
  const columnMapping = {
    title: "task_title",
    description: "task_desc",
    pos: "task_pos",
    due_date: "task_due_date",
    planned: "planned_time",
    reel: "reel_time",
    col_id: "id_col",
    project_id: "id_project",
  };

  // Construit dynamiquement la requête UPDATE
  for (const key of Object.keys(taskData)) {
    if (columnMapping[key]) {
      fields.push(`${columnMapping[key]} = ?`);
      values.push(taskData[key]);
    }
  }

  if (fields.length === 0) {
    return { affectedRows: 0 }; // Rien à mettre à jour
  }

  values.push(idData); // Ajouter l'ID de la tâche pour la clause WHERE

  const sql = `UPDATE taches SET ${fields.join(", ")} WHERE id_task = ?`;

  const [result] = await db.query(sql, values);
  return result;
};

// fonction qui permet de recuperer toutes les tâches

const getAllTasks = async () => {
  const [rows] = await db.query("SELECT * FROM taskflow.taches");
  return rows;
};

// récupérer une tâche par son ID
const getTaskByID = async (id) => {
  const [result] = await db.query("SELECT * FROM taches WHERE id_task = ?", [
    id,
  ]);
  return result;
};

// pour supprimer une tâche
const delTask = async (id) => {
  const [result] = await db.query("DELETE FROM taches WHERE id_task = ?", [id]);
  return result;
};

// Mettre à jour uniquement le statut d'une tâche
const updateTaskStatusInDB = async (taskId, status) => {
  // On recherche l'ID de la colonne qui correspond au statut
  const [col] = await db.query("SELECT id_col FROM colonnes WHERE col_name = ?", [status]);

  if (col.length === 0) {
    throw new Error(`Le statut '${status}' ne correspond à aucune colonne.`);
  }
  const newColId = col[0].id_col;

  const [result] = await db.query(
    "UPDATE taches SET id_col = ? WHERE id_task = ?",
    [newColId, taskId]
  );
  return result;
};

module.exports = {
  getAllTasks,
  getTaskByID,
  createTask,
  updateTask,
  delTask,
  updateTaskStatusInDB,
};
