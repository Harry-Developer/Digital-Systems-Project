const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

//Create view engine
app.set('view engine', 'ejs')

//Encodes url for data passing
app.use(express.urlencoded())
app.use(express.static(__dirname + '/public'));

// index page
app.get('/', (req, res) => {
    res.render('pages/index.ejs')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
})