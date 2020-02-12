exports.submit = function(req, res) {
    
    let pin = req.body.pin;

    if(pin == 8723) 
        res.redirect('/Bruteforce/Flag')

    res.redirect('/Bruteforce')
}