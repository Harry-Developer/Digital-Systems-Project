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

exports.submit = function(req, res) {

    email = req.body.email;
    password = req.body.password;

    connection.query("SELECT * FROM logins WHERE email = '" + email + "' and password = '" + password + "'",  function(error, results) {
        if(error){
            console.log(error)
            res.redirect('/')
        }
        else {
            if(results.length > 0) 
                res.redirect('/SQL-Login/Dashboard')
            else {
                console.log('SELECT * FROM logins WHERE email = ' + email + ' and password = ' + password)
                res.redirect('/')
            }
        }
    })
}