const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/", (req, res) => {
  const filmesPorPagina = 5;
  const paginaAtual = req.query.pagina || 1; // Página padrão é 1

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
        Filme, AnoLancamento, ID
      LIMIT
        ?, ?;
    `;

  // Consulta para obter o número total de filmes
  const countQuery = `SELECT COUNT(*) AS totalFilmes FROM Filmes`;

  // Executar a consulta para obter o total de filmes
  db.query(countQuery, (error, countResults) => {
    if (error) throw error;

    const totalFilmes = countResults[0].totalFilmes;
    const totalPaginas = Math.ceil(totalFilmes / filmesPorPagina);

    // Calcular o índice inicial
    const indiceInicial = (paginaAtual - 1) * filmesPorPagina;

    // Executar a consulta com a lógica de paginação
    db.query(query, [indiceInicial, filmesPorPagina], (error, results) => {
      if (error) throw error;

      // Renderizar a página com os resultados e informações de paginação
      res.render("index", {
        filmes: results,
        paginaAtual: parseInt(paginaAtual),
        totalPaginas: totalPaginas,
      });
    });
  });
});

module.exports = router;
