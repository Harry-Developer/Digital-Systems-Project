const express = require('express')
const flag = require('./routes/flag')
const login = require('./routes/SQL-Login')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

var mysql = require('mysql');
var authenticated = false;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'digital-Systems-Project',
    port     : '8889'
});

connection.connect(function(err){
  
    if(!err) 
        console.log("Database is connected");
    else 
        console.log("Error connecting database, error: " + err);
});

//Create view engine
app.set('view engine', 'ejs')

//Encodes url for data passing
app.use(express.urlencoded())
app.use(express.static(__dirname + '/public'));

// index page
app.get('/', (req, res) => {
    authenticated = false;
    connection.query("SELECT * FROM challenges INNER JOIN Score", function(err, rows, fields) {
       
        if(err){
            console.log(err)
        } else {
            res.render('pages/index.ejs', {
                status:200,
                totalRows: rows.length,
                name: rows,
                desc: rows,
                points: rows,
                difficulty: rows,
                completed: rows,
                url: rows,
                score: rows
            })
        }
    })
})

app.post('/flag-submit', (req, res) => {
    flag.submit(req, res)
})

// lazy admin challenge
app.get('/lazy-admin', (req, res) => {
    authenticated = false;
    res.render('pages/lazy-admin/lazy-admin.ejs')
})

app.post('/admin-dashboard', (req, res) => {
    if(req.body.email == "admin@securebank.com" && req.body.password == "Password1") {
        authenticated = true;
        res.redirect('lazy-admin/admin-dashboard')
    }
    else {
        res.redirect('lazy-admin')
    }
}) 

app.get('/lazy-admin/admin-dashboard', (req, res) => {
    if (authenticated)
        res.render('pages/lazy-admin/admin-dashboard.ejs')
    else 
        res.redirect('/')
})

//Encryption Challenge
app.get('/encryption', (req, res) => {
    res.render('pages/encryption/encryption.ejs')
})

app.get('/encryption/enc-dashboard', (req, res) => {
    if (authenticated)
        res.render('pages/encryption/enc-dashboard.ejs')
    else 
        res.redirect('/')
})

app.post('/enc-dashboard', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if(email == "admin@securebank.com" && password == "Fluffles") {
        authenticated = true;
        res.redirect('/encryption/enc-dashboard')
    }
    else {
        res.redirect('/')
    }
})

//XSS-Search Challange 
app.get('/XSS-Search', (req, res) => {

    connection.query("SELECT * FROM products", function(err, rows, fields) {
        if(err) {
            console.log(err)
        }
        else {
            res.render('pages/XSS-Search/search.ejs', {
                totalRows: rows.length,
                name: rows,
                desc: rows,
                price: rows
            })
        }
    })
})

app.post('/XSS-Search', (req, res) => {
    keyword = "%" + req.body.keyword + "%";

    connection.query("SELECT * FROM products WHERE name like ?", [keyword], function(err, rows, fields) {
        if(err) {
            console.log(err)
        }
        else {
            res.render('pages/XSS-Search/search.ejs', {
                totalRows: rows.length,
                name: rows,
                desc: rows,
                price: rows
            })
        }
    })
})

// SQL Login

app.get('/SQL-Login', (req, res) => {
    res.render('pages/SQL-Login/login.ejs')
})

app.post('/SQL-Login', (req, res) => {
    console.log(login.submit(req, res)) 
    
})

app.get('/SQL-Login/Dashboard', (req, res) => {
    res.render('pages/SQL-Login/dashboard.ejs')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
})

// id, name, description, points, difilculty, completed