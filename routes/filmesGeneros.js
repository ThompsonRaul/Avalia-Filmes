const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/inserir", (req, res) => {
  const sqlFilmes = `
        SELECT * FROM Filmes
        `;

  const sqlGeneros = `
        SELECT * FROM Generos
        `;

  db.query(sqlFilmes, (errorFilmes, resultsFilmes) => {
    if (errorFilmes) throw errorFilmes;

    db.query(sqlGeneros, (errorGeneros, resultsGeneros) => {
      if (errorGeneros) throw errorGeneros;

      // Renderizar a página com os resultados
      res.render("filmes_generos/inserir", {
        filmes: resultsFilmes,
        generos: resultsGeneros,
      });
    });
  });
});

// Rota para processar o formulário e inserir no banco de dados
router.post("/post", (req, res) => {
  const { FilmeID, GeneroID } = req.body;
  const sql = `
      INSERT INTO 
          FilmesGeneros (FilmeID, GeneroID) 
      VALUES 
          (?, ?)`;
  db.query(sql, [FilmeID, GeneroID], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao inserir o conjunto filme/gênero.");
    } else {
      console.log("Conjunto filme/gênero inserido com sucesso!");
      res.redirect("/");
    }
  });
});

module.exports = router;
