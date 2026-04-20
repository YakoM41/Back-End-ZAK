const projectModel = require("../Models/Project");

// Récupère tous les projets
const getProjects = async (req, res) => {
  try {
    const projects = await projectModel.getProjects();
    res.status(200).json(projects);
  } catch (error) {
    console.error("ERREUR DANS GETPROJECTS:", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des projets." });
  }
};

// Récupère un projet par son ID
const getProjectById = async (req, res) => {
  try {
    const { id_project } = req.params;
    const project = await projectModel.getProjectById(id_project);
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé." });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("ERREUR DANS GETPROJECTBYID:", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération du projet." });
  }
};

// Crée un nouveau projet
const createProject = async (req, res) => {
  try {
    const { project_name, project_description } = req.body;

    if (!project_name) {
      return res
        .status(400)
        .json({ message: "Le champ 'project_name' est requis." });
    }

    const projectId = await projectModel.createProject(
      project_name,
      project_description,
    );
    res
      .status(201)
      .json({ message: "Projet créé avec succès.", projectId });
  } catch (error) {
    console.error("ERREUR DANS CREATEPROJECT:", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création du projet." });
  }
};

// Met à jour un projet
const updateProject = async (req, res) => {
  try {
    const { id_project } = req.params;
    const { project_name, project_description } = req.body;

    if (!project_name && !project_description) {
      return res.status(400).json({
        message:
          "Au moins un champ ('project_name' ou 'project_description') est requis.",
      });
    }

    const fields = {};
    if (project_name) fields.project_name = project_name;
    if (project_description) fields.project_description = project_description;

    await projectModel.updateProject(id_project, fields);
    res.status(200).json({ message: "Projet mis à jour avec succès." });
  } catch (error) {
    console.error("ERREUR DANS UPDATEPROJECT:", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du projet." });
  }
};

// Supprime un projet
const deleteProject = async (req, res) => {
  try {
    const { id_project } = req.params;
    await projectModel.deleteProject(id_project);
    res.status(200).json({ message: "Projet supprimé avec succès." });
  } catch (error) {
    console.error("ERREUR DANS DELETEPROJECT:", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression du projet." });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
