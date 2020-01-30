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
                console.log('done')
                res.end()
            }
            else {
                res.redirect('/')
                res.end()
                    
            }
        }
    })
    
}