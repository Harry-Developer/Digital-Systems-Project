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

    let flag = req.body.flag.trim();
    let challenge = req.body.challenge;

    connection.query('SELECT * FROM Flags WHERE flag = ? and challenge = ?', [flag, challenge], function(error, results, fields) {
        if (error) {
            console.log(error)
            res.redirect('/')
            res.end()
        }
        else {
            if(results.length > 0) {

                connection.query('SELECT * FROM challenges WHERE name = ?', [challenge], function(error, results) {
                    if (error) { console.log(error) }
                    else {
                        connection.query('UPDATE score SET score = score + ?', [results[0].points], function(error, results) {
                            if (error) { console.log(error) }
                        })

                        connection.query('UPDATE challenges SET completed = 1 WHERE name = ?', [challenge], function(error, results){
                            if (error){ console.log(error) }
                        })
                    }
                })
                res.redirect('/')
                res.end()
            }
            else {
                res.redirect('/')
                res.end()
                    
            }
        }
    })
    
}