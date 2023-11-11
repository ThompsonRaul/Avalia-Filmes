const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/inserir", (req, res) => {
  res.render("filmes/inserir");
});

// Rota para processar o formulário e inserir no banco de dados
router.post("/post", (req, res) => {
  const { Titulo, AnoLancamento, Classificacao, DuracaoMinutos, Sinopse } =
    req.body;
  const sql = `
      INSERT INTO 
          Filmes (Titulo, AnoLancamento, Classificacao, DuracaoMinutos, Sinopse) 
      VALUES 
          (?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [Titulo, AnoLancamento, Classificacao, DuracaoMinutos, Sinopse],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erro ao inserir o filme.");
      } else {
        console.log("Filme inserido com sucesso!");
        res.redirect("/");
      }
    }
  );
});

router.get("/pesquisar", (req, res) => {
  let searchTerm = req.query.nome || "";
  searchTerm = "%" + searchTerm + "%";

  const query = `
      SELECT
          Filmes.Titulo AS Filme,
          Filmes.AnoLancamento AS AnoLancamento,
          GROUP_CONCAT(DISTINCT Atores.Nome SEPARATOR ', ') AS Atores,
          GROUP_CONCAT(DISTINCT Diretores.NomeDiretor SEPARATOR ', ') AS Diretores,
          GROUP_CONCAT(DISTINCT Generos.NomeGenero SEPARATOR ', ') AS Generos,
          ROUND(AVG(A.Nota), 1) AS MediaAvaliacoes
      FROM
          Filmes
      LEFT JOIN
          FilmesAtores ON Filmes.FilmeID = FilmesAtores.FilmeID
      LEFT JOIN
          Atores ON FilmesAtores.AtorID = Atores.AtorID
      LEFT JOIN
          FilmesDiretores ON Filmes.FilmeID = FilmesDiretores.FilmeID
      LEFT JOIN
          Diretores ON FilmesDiretores.DiretorID = Diretores.DiretorID
      LEFT JOIN
          FilmesGeneros ON Filmes.FilmeID = FilmesGeneros.FilmeID
      LEFT JOIN
          Generos ON FilmesGeneros.GeneroID = Generos.GeneroID
      LEFT JOIN
          Avaliacoes A ON Filmes.FilmeID = A.FilmeID
      WHERE 
          Filmes.Titulo LIKE ?
      GROUP BY
          Filme, AnoLancamento;
    `;

  db.query(query, [searchTerm], (error, filmes) => {
    if (error) {
      console.error("Erro:", error);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.render("filmes/pesquisar", { filmes, searchTerm });
    }
  });
});

// Rota para exibir o formulário de atualização
router.get("/editar/:id", (req, res) => {
  const filmeID = req.params.id;
  const query = "SELECT * FROM Filmes WHERE FilmeID = ?";
  db.query(query, [filmeID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao buscar o filme.");
    } else if (results.length > 0) {
      const filme = results[0];
      res.render("filmes/editar", { filme });
    } else {
      res.status(404).send("Filme não encontrado.");
    }
  });
});

// Rota para processar a atualização
router.post("/update", (req, res) => {
  const {
    FilmeID,
    Titulo,
    AnoLancamento,
    Classificacao,
    DuracaoMinutos,
    Sinopse,
  } = req.body;
  const query =
    "UPDATE Filmes SET Titulo = ?, AnoLancamento = ?, Classificacao = ?, DuracaoMinutos = ?, Sinopse = ? WHERE FilmeID = ?";
  db.query(
    query,
    [Titulo, AnoLancamento, Classificacao, DuracaoMinutos, Sinopse, FilmeID],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar o filme.");
      } else {
        res.redirect("/");
      }
    }
  );
});
module.exports = router;
