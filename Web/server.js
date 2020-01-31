const express = require('express')
const flag = require('./routes/flag')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

var mysql = require('mysql');

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
    res.render('pages/lazy-admin/lazy-admin.ejs')
})

app.get('/admin-dashboard', (req, res) => {
    res.render('pages/lazy-admin/admin-dashboard.ejs')
})

//Encryption Challenge
app.get('/encryption', (req, res) => {
    res.render('pages/encryption/encryption.ejs')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
})

// id, name, description, points, difilculty, completed