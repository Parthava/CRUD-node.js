const express = require('express');
const bodyParser = require('body-parser') //middleware used to request data from form
const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'postblog'
});

// Connect
db.connect((err) => {
    if(err){
        return console.log(err);
    }
    else{
    	console.log('MySql Connected...');
    }
});

const app = express();

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

let urlencodedParser = bodyParser.urlencoded({ extended: false }) //middleware used to request data from form

//------------ Mysql create db and table start -------------//
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE postblog';
    db.query(sql, (err, result) => {
        if(err) {
        	return console.log(err);
        }
        else {
        	console.log(result);
        	res.send('Database created...');
        }
        
    });
});

app.get('/createpoststable', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), author VARCHAR(255), date VARCHAR(255), content MEDIUMTEXT, PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) {
        	return console.log(err);
        }
        else {
        	console.log(result);
        	res.send('Posts table created...');
        }
        
    });
});
//------------ Mysql create db and table ends -------------//

app.get('/', (req,res) => {
	let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) => {
        if(err) {
        	return console.log(err);
        }
        else {
        	console.log(results);
        	res.render('index', {datas: results});
        }
    });
});

app.post('/newpost', urlencodedParser, (req,res) => {
	const postdate = new Date();
	date = String(postdate);
	//console.log(postdate);
	const {title, author, content} = req.body;
	//console.log(req.body);
	let post = {title:title, author:author, date:date, content:content};
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err) {
        	return console.log(err);
        }
        else{
        	console.log(result);
        	return res.redirect('/');
        }
    });
});

app.get('/newpost', (req,res) => {
	res.render('newpost');
});


app.get('/editpost/:id', (req, res) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) {
        	return console.log(err);
        }
        else {
        	console.log(result);
        	res.render('editpost', {data: result});
        }
    });
});

app.post('/editpost/:id', urlencodedParser, (req, res) => {
    const postdate = new Date();
	date = String(postdate);
	//console.log(postdate);
	const {title, author, content} = req.body;
	//console.log(req.body);

    let sql = `UPDATE posts SET title = '${title}', author = '${author}', content = '${content}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) {
        	return console.log(err);
        }
        else {
        	console.log(result);
        	return res.redirect('/');
        }
    });
});

// Delete post
app.get('/deletepost/:id', (req, res) => {
    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) {
        	return console.log(err);
        }
        else {
        	console.log(result);
        	return res.redirect('/');
        }
    });
});

PORT = 3000

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});