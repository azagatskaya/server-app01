const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const db_name = "notes01";

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "V_N8$F*f_WPBgvd",
  database: db_name,
});

const PORT = 3000;
const app = express();

const urlencodedParser = express.urlencoded({ extended: false });
app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
  console.log("Server started on port 3000");
});

//connect
db.connect((err) => {
  if (err) throw err;
  console.log("mySQL connected");
});

//create DB
app.get("/createdb", (req, res) => {
  const sql = "CREATE DATABASE notes01";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("DB created");
  });
});

//create table
app.get("/createnotestable", (req, res) => {
  const sql =
    "CREATE TABLE notes(id int AUTO_INCREMENT, title VARCHAR(45), body VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Notes table created");
  });
});

//insert data in table
app.post("/addnote", urlencodedParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log(req);
  const title = req.body.title;
  const text = req.body.text;
  console.log(title);
  console.log(text);
  const sql = `INSERT INTO notes (title, body) VALUES ('${title}', '${text}');`;
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.send("Add Note Server");
  });
});

// select records
app.get("/getnotes", (req, res) => {
  const sql = "SELECT * FROM notes";
  db.query(sql, (err, results) => {
    console.log("received request");
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(results);
    res.send(results);
    console.log("I've sent results");
  });
});

//get headers
app.get("/getheaders", (req, res) => {
  const sql = `SELECT COLUMN_NAME 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME='notes';`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//select single note
app.get("/getnote/:id", (req, res) => {
  console.log(req.params.id);
  let sql = `SELECT * FROM notes WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.post("/deletenotes", urlencodedParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log(req.body);
  const ids = req.body;
  const sql = `DELETE FROM notes WHERE id IN(${ids})`;
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.send("Deleted Notes from Server");
  });
});

app.post("/updatenote", urlencodedParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log(req.body);
  const id = req.body.id;
  const title = req.body.title;
  const text = req.body.text;
  const sql = `UPDATE notes SET title='${title}', body='${text}' WHERE id=${id};`;
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.send("Note is Updated");
  });
});
