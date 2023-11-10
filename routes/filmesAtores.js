const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/inserir", (req, res) => {
  const sqlFilmes = `
        SELECT * FROM Filmes
        `;

  const sqlAtores = `
        SELECT * FROM Atores
        `;

  db.query(sqlFilmes, (errorFilmes, resultsFilmes) => {
    if (errorFilmes) throw errorFilmes;

    db.query(sqlAtores, (errorAtores, resultsAtores) => {
      if (errorAtores) throw errorAtores;

      // Renderizar a página com os resultados
      res.render("filmes_atores/inserir", {
        filmes: resultsFilmes,
        atores: resultsAtores,
      });
    });
  });
});

// Rota para processar o formulário e inserir no banco de dados
router.post("/post", (req, res) => {
  const { FilmeID, AtorID } = req.body;
  const sql = `
      INSERT INTO 
          FilmesAtores (FilmeID, AtorID) 
      VALUES 
          (?, ?)`;
  db.query(sql, [FilmeID, AtorID], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao inserir o conjunto filme/ator.");
    } else {
      console.log("Conjunto filme/ator inserido com sucesso!");
      res.redirect("/");
    }
  });
});

module.exports = router;
