const { isProjectManager } = require("../Models/Role");

const checkProjectManager = async (req, res, next) => {
  const userId = req.user.id; // L'ID extrait du token
  const projectId = req.body.project_id; // L'ID du projet envoyé dans le JSON

  const isAllowed = await isProjectManager(userId, projectId);
  if (!isAllowed) {
    return res
      .status(403)
      .json({ message: "Vous ne pouvez pas ajouter de tâche à ce projet." });
  }
  next();
};

module.exports = { checkProjectManager };
