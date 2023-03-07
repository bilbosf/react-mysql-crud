const config = require("./config")
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

const db = mysql.createPool({
  host: config.MYSQL_HOST,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
});

app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
  const { name } = req.body;
  const { cost } = req.body;
  const { category } = req.body;

  let mysql = `INSERT INTO ${config.MYSQL_TABLE} ( name, cost, category) VALUES (?, ?, ?)`;
  db.query(mysql, [name, cost, category], (err, result) => {
    res.send(result);
  });
});

app.post("/search", (req, res) => {
  const { name } = req.body;
  const { cost } = req.body;
  const { category } = req.body;

  let mysql =
    `SELECT * from ${config.MYSQL_TABLE} WHERE name = ? AND cost = ? AND category = ?`;
  db.query(mysql, [name, cost, category], (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.get("/getCards", (req, res) => {
  console.log(`requisicao recebida`);
  let mysql = `SELECT * FROM ${config.MYSQL_TABLE}`;
  db.query(mysql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/edit", (req, res) => {
  const { id } = req.body;
  const { name } = req.body;
  const { cost } = req.body;
  const { category } = req.body;
  let mysql = `UPDATE ${config.MYSQL_TABLE} SET name = ?, cost = ?, category = ? WHERE id = ?`;
  db.query(mysql, [name, cost, category, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  let mysql = `DELETE FROM ${config.MYSQL_TABLE} WHERE id = ?`;
  db.query(mysql, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(config.LISTEN_PORT, () => {
  console.log(`rodando na porta ${config.LISTEN_PORT}`);

  let mysql = `CREATE TABLE IF NOT EXISTS ${config.MYSQL_TABLE} (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    cost VARCHAR(45) NOT NULL,
    category VARCHAR(45) NOT NULL,
    PRIMARY KEY (id));`;

  db.query(mysql, (err, result) => {
    if (err) {
      console.log(err);
    }
  });

});
