const db = require("../db");

const sql = `
  SELECT * FROM participer 
  INNER JOIN roles ON participer.id_role = roles.id_role 
  WHERE participer.id_user = ? 
    AND participer.id_project = ? 
    AND roles.libelle_role = ?
`;

// Les paramètres à envoyer à db.execute()

const isProjectManager = async (userId, projectId) => {
  // On utilise la variable 'sql' définie plus haut qui contient le JOIN
  const [rows] = await db.query(sql, [userId, projectId, "Chef de projet"]);

  return rows.length > 0;
};

module.exports = { isProjectManager };
