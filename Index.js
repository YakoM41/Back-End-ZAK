const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config(); // permet de charger les var d'env depuis .env
const cookieParser = require("cookie-parser");

const authRoutes = require("./Endpoints/authRoutes");
const taskRoutes = require("./Endpoints/taskRoutes");
const projectRoutes = require("./Endpoints/projectRoutes");
const columnRoutes = require("./Endpoints/columnRoutes");

// Connx a la BDD
const db = require("./db");

// Importation des routes
// Créa de l'application Express
const app = express();

// Middlewares
// Parser les JSON
app.use(express.json());

// Logger de requête HTTP dans la console (a commenter au passage en ligne)
app.use(morgan("dev"));

// Cors permet les requêtes cross-origines (entre front et bdd)
// Cross Origin Ressource Sharing (CORS) - Obligatoire sinon le navigateur bloque les requetes
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins, // Utilisation directe du tableau
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parser les cookies dans req
app.use(cookieParser());

// ROUTES

// Route de test pour verif' que l'API fonctionne
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API fonctionnelle",
  });
});

// Routes de l'API
app.use("/api/users", authRoutes);
app.use("/api/taches", taskRoutes); // On évite l'accent pour être plus "safe"
app.use("/api", projectRoutes);
app.use("/api", columnRoutes);

// Gestion des erreurs

// Route 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route non trouvée",
  });
});

// Démarrage du serveur
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  console.log(`Serveur démarré sur http://${host}:${port}`);
});
