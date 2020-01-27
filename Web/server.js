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

// lazy admin challenge
app.get('/lazy-admin', (req, res) => {
    res.render('pages/lazy-admin/lazy-admin.ejs')
})

app.get('/admin-dashboard', (req, res) => {
    res.render('pages/lazy-admin/admin-dashboard.ejs')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
})