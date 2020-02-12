function generateInviteCode() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/generate/invite',
        success: function(res) {
            console.log(res)
        },
        error: function(res) {
            console.log(res)
        }
    })
}