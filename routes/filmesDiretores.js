const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/inserir", (req, res) => {
  const sqlFilmes = `
        SELECT * FROM Filmes
        `;

  const sqlDiretores = `
        SELECT * FROM Diretores
        `;

  db.query(sqlFilmes, (errorFilmes, resultsFilmes) => {
    if (errorFilmes) throw errorFilmes;

    db.query(sqlDiretores, (errorDiretores, resultsDiretores) => {
      if (errorDiretores) throw errorDiretores;

      // Renderizar a página com os resultados
      res.render("filmes_diretores/inserir", {
        filmes: resultsFilmes,
        diretores: resultsDiretores,
      });
    });
  });
});

// Rota para processar o formulário e inserir no banco de dados
router.post("/post", (req, res) => {
  const { FilmeID, DiretorID } = req.body;
  const sql = `
      INSERT INTO 
          FilmesDiretores (FilmeID, DiretorID) 
      VALUES 
          (?, ?)`;
  db.query(sql, [FilmeID, DiretorID], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao inserir o conjunto filme/diretor.");
    } else {
      console.log("Conjunto filme/diretor inserido com sucesso!");
      res.redirect("/");
    }
  });
});

module.exports = router;
