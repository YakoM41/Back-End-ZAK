const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/projectController');

// Route pour récupérer tous les projets
router.get('/projects', projectController.getProjects);

// Route pour récupérer un projet par son ID
router.get('/projects/:id_project', projectController.getProjectById);

// Route pour créer un nouveau projet
router.post('/projects', projectController.createProject);

// Route pour mettre à jour un projet
router.put('/projects/:id_project', projectController.updateProject);

// Route pour supprimer un projet
router.delete('/projects/:id_project', projectController.deleteProject);

module.exports = router;
