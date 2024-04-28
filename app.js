// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root123',
  password: 'root123',
  database: 'library'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

app.get('/getAllBooks', (req, res) => {
  const sql = 'SELECT * FROM book_crud';
  console.log(req.body+"req.body of getallbooks");
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error getting books: ' + err.stack);
      res.sendStatus(500);
      return;
    }
    res.json(result);
    console.log("getallbooks app.js result"+ result);
  });
});

app.post('/addBook', (req, res) => {
  const { bookName } = req.body;
  console.log(req.body+"reqbody");
  const takenOn = new Date().toISOString().slice(0, 10);
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 14); // Assuming a 14-day return period
  const fineCharged = 0; // Assuming no fine initially

  const sql = 'INSERT INTO book_crud (name, taken_on, return_date, fine_charged) VALUES (?, ?, ?, ?)';
  connection.query(sql, [bookName, takenOn, returnDate.toISOString().slice(0, 10), fineCharged], (err, result) => {
    if (err) {
      console.error('Error adding book: ' + err.stack);
      res.sendStatus(500);
      return;
    }
    console.log('Book added successfully');
    const bookId = result.insertId; // Get the ID of the inserted book
    console.log("addbook app.js bookid:"+bookId);
    res.json({ id: bookId }); // Send the ID back to the client
  });
});


app.post('/returnBook/:id', (req, res) => {
  const id = req.params.id;
  console.log("Book id is = "+ id);
  const sql = `DELETE FROM book_crud WHERE id = ?`;
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting book: ' + err.stack);
      res.sendStatus(500);
      return;
    }
    console.log('Book deleted successfully');
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
