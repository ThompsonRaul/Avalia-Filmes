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
  db.query("SELECT * FROM Generos", (error, results) => {
    if (error) {
      console.error("Erro ao obter gêneros:", error);
      res.status(500).send("Erro interno do servidor");
    } else {
      const generos = results;
      res.render("generos/pesquisar", { generos });
    }
  });
});

router.get("/resultados_pesquisa", (req, res) => {
  const { generoId } = req.query;

  // Consulta para obter o nome do gênero
  db.query(
    "SELECT NomeGenero FROM Generos WHERE GeneroID = ?",
    [generoId],
    (error, results) => {
      if (error) {
        console.error("Erro ao obter nome do gênero:", error);
        res.status(500).send("Erro interno do servidor");
      } else {
        const generoNome = results[0].NomeGenero;

        // Consulta para obter filmes por gênero usando GROUP_CONCAT DISTINCT
        db.query(
          `SELECT 
            '${generoNome}' AS NomeGenero,
            GROUP_CONCAT(DISTINCT F.Titulo ORDER BY F.Titulo SEPARATOR ', ') AS TitulosFilmes
          FROM Filmes F
          JOIN FilmesGeneros FG ON F.FilmeID = FG.FilmeID
          JOIN Generos G ON FG.GeneroID = G.GeneroID
          WHERE G.GeneroID = ?
          GROUP BY '${generoNome}';`,
          [generoId],
          (error, resultadosPesquisa) => {
            if (error) {
              console.error("Erro na pesquisa de filmes por gênero:", error);
              res.status(500).send("Erro interno do servidor");
            } else {
              const filmesPorGenero = resultadosPesquisa;
              res.render("generos/resultados_pesquisa", {
                generoNome,
                filmesPorGenero,
              });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
