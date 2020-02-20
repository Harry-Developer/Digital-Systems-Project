const express = require('express')
const flag = require('./routes/flag')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

var mysql = require('mysql');
var authenticated = false;
var challengeType = "Steg"

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
    connection.query("SELECT * FROM challenges INNER JOIN Score WHERE type = ? ORDER BY points ", [challengeType], function(err, rows, fields) {
       
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
                score: rows,
                image: rows
            })
        }
    })
})

app.post('/flag-submit', (req, res) => {
    flag.submit(req, res)
})

//Reset Challenges 

app.post('/reset-challenges', (req, res) => {
    
    connection.query('UPDATE challenges SET completed = 0 WHERE completed = 1 and type = ?', [challengeType], function(error, results){
        if (error){ console.log(error) }
    })

    connection.query('UPDATE score SET score = 0', function(error, results) {
        if (error) { console.log(error) }
    })

    res.redirect('/')
 })

app.get('/add-challenge', (req, res) => {
    res.render('pages/add-challenge.ejs', {added: false})
})


app.post('/add-challenge', (req, res) => {

    var name = req.body.name
    var description = req.body.description
    var points = req.body.points
    var difficulty = req.body.difficulty
    var completed = 0;
    var url = '/'
    var type = 'Steg'
    var flag = req.body.flag

    var filename = req.body.filename
    
    var challenge = {
        name: name, 
        description: description, 
        points: points, 
        difficulty: difficulty, 
        completed: completed,
        url: url,
        type: type,
        filename: filename
    }
    
    connection.query('INSERT INTO challenges SET ?', challenge, function (error, results, fields) {
        if (error) throw error;
    });

    var flagInput = {flag: flag, challenge: name}

    connection.query('INSERT INTO Flags SET ?', flagInput, function (error, results, fields) {
        if (error) throw error;
    });

    res.render('pages/add-challenge.ejs', {added: true})
    
})

 app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
})
