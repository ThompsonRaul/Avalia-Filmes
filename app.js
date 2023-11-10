const bodyParser = require("body-parser");
const indexRoutes = require("./routes/index");
const filmesRoutes = require("./routes/filmes");
const atoresRoutes = require("./routes/atores");
const filmesAtoresRoutes = require("./routes/filmesAtores");
const diretoresRoutes = require("./routes/diretores");
const filmesDiretoresRoutes = require("./routes/filmesDiretores");
const generosRoutes = require("./routes/generos");
const filmesGenerosRoutes = require("./routes/filmesGeneros");
var express = require("express");
var app = express();
// Configuração do EJS como view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", indexRoutes);
app.use("/filmes", filmesRoutes);
app.use("/atores", atoresRoutes);
app.use("/filmes_atores", filmesAtoresRoutes);
app.use("/diretores", diretoresRoutes);
app.use("/filmes_diretores", filmesDiretoresRoutes);
app.use("/generos", generosRoutes);
app.use("/filmes_generos", filmesGenerosRoutes);

app.listen(process.env.DB_PORT, () => {
  console.log(`SERVIDOR ATIVO, ACESSE http://localhost:${process.env.DB_PORT}`);
});
