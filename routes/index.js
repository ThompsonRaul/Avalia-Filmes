const express = require("express");
const router = express.Router();
const db = require("../db.js");

// Rota para a página inicial
router.get("/", (req, res) => {
  const query = `
          SELECT
          Filmes.FilmeID AS ID,
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
          GROUP BY
              Filme, AnoLancamento, ID;
      `;

  // Executar a consulta
  db.query(query, (error, results) => {
    if (error) throw error;

    // Renderizar a página com os resultados
    res.render("index", { filmes: results });
  });
});

module.exports = router;
