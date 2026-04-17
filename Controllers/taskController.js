// CONTROLLER PRODUITS
const { getAllTasks, getTaskByID } = require("../Models/Task");
const { isProjectManager } = require("../Models/Role");

//LE MODÈLE ENVOIE DES DONNEES ICI ET LE CONTROLLER LES ENVOIENT A L'UTILISATEUR

//créer une tâche
const { createTask } = require("../Models/Task");

const create = async (req, res) => {
  // On extrait les données
  const {
    title,
    description,
    pos,
    due_date,
    planned,
    reel,
    col_id,
    project_id,
  } = req.body;
  const userId = req.user.id;
  try {
    // On vérifie si elles sont présentes
    if (!title || !col_id || !project_id) {
      return res.status(400).json({
        message:
          "Erreur : Le titre, la colonne et le projet sont obligatoires.",
      });
    }

    const isManager = await isProjectManager(userId, project_id);

    if (!isManager) {
      return res.status(403).json({
        message:
          "Accès refusé : Seul le chef de projet peut ajouter une tâche.",
      });
    }

    // Appel du modèle
    const result = await createTask({
      task_title: title,
      task_desc: description,
      task_pos: pos,
      task_due_date: due_date,
      planned_time: planned,
      reel_time: reel,
      id_col: col_id,
      id_project: project_id,
    });
    if (result.affectedRows > 0) {
      res.status(201).json({
        message: "Votre tâche a bien été créée ",
        id_task: result.insertId,
        task: {
          title,
          description,
          pos,
          due_date,
          planned,
          reel,
          col_id,
          project_id,
        },
      });
    } else {
      res.status(400).json({ message: "La tâche n'a pas pu être créée." });
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout", error.message);
    res.status(500).json({
      message: "Erreur lors de l'ajout de la tâche",
    });
  }
};

//récupérer tous les produits

const getAll = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.json({
      message: "Produits récupérer avec succès",
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Erreur de récupération des tâches", error.message);
    res.status(500).json({
      message: "Erreur de récupération des tâches",
    });
  }
};

//Récupérer une tâche par son ID
const getByID = async (req, res) => {
  try {
    const { id } = req.params; //ou on peut aussi faire const id = req.params.id; mais cela ne prendra qu'un parametre
    const taskId = parseInt(id);
    const tasks = await getTaskByID(taskId);
    if (tasks.length === 0) {
      return res.status(404).json({
        message: "Tâche non trouvée",
      });
    }
    res.json({
      message: "Tâche récupérée avec succès",
      task: tasks[0],
    });
  } catch (error) {
    console.error("Erreur de récupération de la tâche", error.message);
    res.status(500).json({
      message: "Erreur de récupération de la tâche",
    });
  }
};

module.exports = { getAll, getByID, create };
