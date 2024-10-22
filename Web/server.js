const express = require('express')
const flag = require('./routes/flag')
const login = require('./routes/SQL-Login')
const bruteforce = require('./routes/bruteforce')
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
    connection.query("SELECT * FROM challenges INNER JOIN Score WHERE type != 'Steg' ORDER BY points", function(err, rows, fields) {
       
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
    login.submit(req, res)
})

app.get('/SQL-Login/Dashboard', (req, res) => {
    res.render('pages/SQL-Login/dashboard.ejs')
})

// Hash 

app.get('/Hash', (req, res) => {
    res.render('pages/Hash/hash.ejs')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
})

//Brute Force 

app.get('/Bruteforce', (req, res) => {
    res.render('pages/Bruteforce/index.ejs')
})

app.post('/Bruteforce', (req, res) => {
    bruteforce.submit(req, res)
})

app.get('/Bruteforce/Flag', (req, res) => {
    res.render('pages/Bruteforce/flag.ejs')
})

// User Agent Spoof

app.get('/Headers', (req, res) => {
    let ua = req.get('User-Agent')
    let ref = req.headers.referer || ''
    res.render('pages/Headers/index.ejs', {
        ua: ua,
        ref: ref
    })
})

// Source Code

app.get('/Source-Code', (req, res) => {
    res.render('pages/Source Code/index.ejs')
})

app.get('/Source-Code/about', (req, res) => {
    res.render('pages/Source Code/about.ejs')
})

app.get('/Source-Code/contact', (req, res) => {
    res.render('pages/Source Code/contact.ejs')
})

// Mr Robot 
app.get('/Robot', (req, res) => {
    res.render('pages/Robot/index.ejs')
})

app.use('/robots.txt', function (req, res, next) {
    res.type('text/plain')
    res.send("User-agent: *\nDisallow: /Robot");
});

app.get('/Postman', (req, res) => {
    res.render('pages/postman/index.ejs')
})

app.post('/Postman', (req, res) => {
    var username = req.param('username')
    var password = req.param('password')

    if(username == "admin" && password == "SecretAdminPass") {
        res.send("CTF{WELCOME_TO_HOGWARTS}")
    } else {
        res.render('pages/postman/index.ejs')
    }
})

//Rabbit hole

app.get('/RabbitHole', (req, res) => {
    res.render('pages/rabbithole/index.ejs', {flag: ""})
})

app.post('/RabbitHole', (req, res) => {
    let code = req.body.code;

    if(code == "SUHD-MNSF-SOIJ") {
        res.render('pages/rabbithole/index.ejs', {flag: "CTF{REQUESTS}"})
    } else {
        res.render('pages/rabbithole/index.ejs', {flag: ""})
    }
})

app.post('/generate/invite', (req, res) => {
    res.json({
        data: "eqzp baef dqcgqef fa /sqzqdmfq/oapq",
        status: 200
    })
})

app.post('/generate/code', (req, res) => {
    res.json({
        data: "U1VIRC1NTlNGLVNPSUo=",
        status: 200
    })
})

// SQL Dump 

app.get('/SQL-Dump', (req, res) => {

    res.render('pages/SQL-Dump/index.ejs', {
        totalRows: 0,
        name: "",
        desc: "",
    })

})

app.post('/SQL-Dump', (req, res) => {

    keyword = req.body.keyword;

    connection.query("SELECT * FROM cakes WHERE name = '" + keyword + "'", function(err, rows, fields) {
        if(err) {
            console.log(err)
        }
        else {
            res.render('pages/SQL-Dump/index.ejs', {
                totalRows: rows.length,
                name: rows,
                desc: rows,
            })
        }
    })
    
})


//Union 
app.get('/Union', (req, res) => {

    res.render('pages/Union/index.ejs', {
        totalRows: 0,
        name: "",
        desc: "",
    })

})

app.post('/Union', (req, res) => {

    keyword = req.body.keyword;

    if(keyword.includes("from flags") || keyword.includes("from cakes")) {
        res.send("Nah, you don't touch that table, go <a href='/Union'> back </a> ")
    }
    
    connection.query("SELECT * FROM products WHERE id = " + keyword, function(err, rows, fields) {
        if(err) {
            console.log(err)
        }
        else {
            res.render('pages/Union/index.ejs', {
                totalRows: rows.length,
                name: rows,
                desc: rows,
                price: rows
            })
        }
    })
    
})

//Reset Challenges 

app.post('/reset-challenges', (req, res) => {
    connection.query('UPDATE challenges SET completed = 0 WHERE completed = 1', function(error, results){
        if (error){ console.log(error) }
    })

    connection.query('UPDATE score SET score = 0', function(error, results) {
        if (error) { console.log(error) }
    })

    res.redirect('/')
 })

// id, name, description, points, difilculty, completed