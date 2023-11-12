const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/inserir", (req, res) => {
  res.render("atores/inserir");
});

router.post("/post", (req, res) => {
  const { Nome } = req.body;
  const sql = `
        INSERT INTO 
            Atores (Nome) 
        VALUES 
            (?)`;
  db.query(sql, [Nome], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao inserir o ator.");
    } else {
      console.log("Ator inserido com sucesso!");
      res.redirect("/");
    }
  });
});

router.get("/pesquisar", (req, res) => {
  res.render("atores/pesquisar");
});

router.get("/resultados_pesquisa", (req, res) => {
  let searchTerm = req.query.nome || "";
  searchTerm = "%" + searchTerm + "%";

  const query = `
  SELECT
    A.Nome AS NomeAtor,
  GROUP_CONCAT(F.Titulo SEPARATOR ', ') AS FilmesAtuados
  FROM
    Atores A
  JOIN
    FilmesAtores FA ON A.AtorID = FA.AtorID
  JOIN
    Filmes F ON FA.FilmeID = F.FilmeID
  WHERE
    A.Nome LIKE ?
  GROUP BY
    A.Nome;
`;

  db.query(query, [searchTerm], (error, atores) => {
    if (error) {
      console.error("Erro:", error);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.render("atores/resultados_pesquisa", { atores, searchTerm });
    }
  });
});

module.exports = router;
