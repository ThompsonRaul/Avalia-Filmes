const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/inserir", (req, res) => {
  res.render("generos/inserir");
});

router.post("/post", (req, res) => {
  const { NomeGenero } = req.body;
  const sql = `
        INSERT INTO 
            Generos (NomeGenero) 
        VALUES 
            (?)`;
  db.query(sql, [NomeGenero], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao inserir o gênero.");
    } else {
      console.log("Gênero inserido com sucesso!");
      res.redirect("/");
    }
  });
});


router.get("/pesquisar", (req, res) => {
  let searchTerm = req.query.nome || "";
  searchTerm = "%" + searchTerm + "%";
  const queryGenero = `
        SELECT
            *
        FROM
            Generos
    `;

  const query = `
  SELECT
    G.NomeGenero AS Genero,
    GROUP_CONCAT(F.Titulo SEPARATOR ', ') AS FilmesGeneros
  FROM
    Generos G
  JOIN
    FilmesGeneros FG ON G.GeneroID = FG.GeneroID
  JOIN
    Filmes F ON FG.FilmeID = F.FilmeID
  WHERE
    G.NomeGenero LIKE ?
  GROUP BY
    G.NomeGenero;
  `;

  // Fazendo as duas consultas em paralelo usando Promise.all
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(query, [searchTerm], (error, generos) => {
        if (error) {
          console.error("Erro:", error);
          reject(error);
        } else {
          resolve(generos);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(queryGenero, (error, generos) => {
        if (error) {
          console.error("Erro:", error);
          reject(error);
        } else {
          resolve(generos);
        }
      });
    }),
  ])
    .then(([generosFilmes, generos]) => {
      res.render("generos/pesquisar", { generosFilmes, generos, searchTerm });
    })
    .catch((error) => {
      console.error("Erro interno do servidor:", error);
      res.status(500).send("Erro interno do servidor");
    });
});

module.exports = router;
