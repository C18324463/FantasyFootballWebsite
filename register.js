
function createNewUser() {
    const data = {
        email: $('#email')[0].value,
        fName: $('#fName')[0].value,
        lName: $('#lName')[0].value,
        password: $('#password')[0].value
    }
    const post = $.post('http://localhost:3030/register', data);
    post.done(processUserSuccess);
    post.fail(processUserErrors);
}

$('#formNewUser').validate({
    rules: {
        fName: {
            required: true,
        },
        lName: {
            required: true,
        },
        email: {
            required: true,
            minlength: 5,
            maxlength: 50
        },
        password: {
            required: true,
        },
    },
    messages: {
        fName: {
            required: 'Please fill in a first name to register.',
        },
        lName: {
            required: 'Please fill in a last name to register.',
        },
        email: {
            required: 'Please fill in an email name to register.',
        },
        password: {
            required: 'Please choose a password to register.',
        },
    },

    SubmitHandler: createNewUser
});


$('#btnSubmit').click(function() {
    $('#formNewUser').submit();
});

function processUserSuccess(rows, status, xhr) {
    console.log("Hello");
}

function processUserErrors(error, status, xhr) {
    console.log(error);
    const errorMsg = error.responseJSON.error;
    $(`<div class='alert alert-danger'>${errorMsg}</div>`).appendTo('.container');
}