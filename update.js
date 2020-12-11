$('#btnEmail').click(function(){
    updateUser();
});

function updateUser(){
    $('#formUpdate').hide();
    $('#formEmail').show();

    const data = {
        email: $('#email')[0].value,
        emailNew: $('#emailNew')[0].value
    }
    const post = $.post('http://localhost:3030/updateuser', data);
    post.done(successLoad);
    post.fail(displayError);
}


function successLoad(){
    console.log(1)
}

function displayError(){
    console.log(0)
}