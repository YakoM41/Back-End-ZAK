// ROUTER produits
//Chemin : /api/tâches

const express = require("express");
const { getAll, getByID, create } = require("../controllers/taskController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { checkProjectManager } = require("../Middleware/checkProjectManager");

const router = express.Router();

router.post("/", verifyToken, checkProjectManager, create);

//GET /api/tâches - Récupérer toutes les tâches

router.get("/", getAll);

//GET /api/tâches/:id récupérer une tâche par son ID

router.get("/:id", getByID);

module.exports = router;
