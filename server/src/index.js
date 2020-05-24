const express = require("express");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => res.json({ error: err.message }));

app.listen(8080, () => {
  console.log("Servidor porta 8080");
});
