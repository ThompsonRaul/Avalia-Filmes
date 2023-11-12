const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/inserir", (req, res) => {
  res.render("diretores/inserir");
});

router.post("/post", (req, res) => {
  const { NomeDiretor } = req.body;
  const sql = `
        INSERT INTO 
            Diretores (NomeDiretor) 
        VALUES 
            (?)`;
  db.query(sql, [NomeDiretor], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao inserir o diretor.");
    } else {
      console.log("Diretor inserido com sucesso!");
      res.redirect("/");
    }
  });
});

router.get("/pesquisar", (req, res) => {
  res.render("diretores/pesquisar");
});

router.get("/resultados_pesquisa", (req, res) => {
  let searchTerm = req.query.nome || "";
  searchTerm = "%" + searchTerm + "%";

  const query = `
  SELECT
    D.NomeDiretor AS NomeDiretor,
  GROUP_CONCAT(F.Titulo SEPARATOR ', ') AS FilmesDirigidos
  FROM
    Diretores D
  JOIN
    FilmesDiretores FD ON D.DiretorID = FD.DiretorID
  JOIN
    Filmes F ON FD.FilmeID = F.FilmeID
  WHERE
    D.NomeDiretor LIKE ?
  GROUP BY
    D.NomeDiretor;
`;

  db.query(query, [searchTerm], (error, diretores) => {
    if (error) {
      console.error("Erro:", error);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.render("diretores/resultados_pesquisa", { diretores, searchTerm });
    }
  });
});

module.exports = router;
