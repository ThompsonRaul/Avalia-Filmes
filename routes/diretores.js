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

module.exports = router;
