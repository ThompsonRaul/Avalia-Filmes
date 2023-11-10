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

module.exports = router;
