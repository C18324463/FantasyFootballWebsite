$(document).ready(() => {
    const post = $.get("http://localhost:3030/admin")
})

$('#btnShow').click(function(){
    showData();
});

$('#btnSubmit').click(function(){
    $('#formDelete').submit();
});

$('#btnDel').click(function(){
    deleteUsers();
});

$('#return').click(function(){
    location.reload();
});

function successLoad(){
    
}

function deleteUsers(){
    $("#formShow").hide();
    $("#formDelete").show();
    $("#return").show();

    const data = {
        email: $('#email')[0].value
    }
    const post = $.post('http://localhost:3030/deleteUser', data);
    post.done(successLoad);
    post.fail(displayError);
}

function showData(){
    const post = $.get("http://localhost:3030/showusers");
    post.done(buildUserTable);
    post.fail(displayError);
}


function buildUserTable(rows, status, xhr){
    console.log("hello");

    $(".containerTable").show();
    $("#formShow").hide();
    $("#return").show();

    let userTable = `
    <table id="userTable" class="table">
    <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Email</th>
            <th scope="col">First</th>
            <th scope="col">Second</th>
        </tr>
    </thead>
    <tbody id='tableBody'>
    </tbody>
    </table>`;
    $(userTable).appendTo('#colTable');
    for (let i = 0; i < rows.length; i++) {
        const trId = `tr${rows[i].user_id}`;
        $(`<tr id='${trId}'></tr>`).appendTo('#tableBody');
        $(`<td> ${rows[i].user_id}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].user_email}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].user_first}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].user_second}</td>`).appendTo(`#${trId}`);
    }
}


function displayError(error, status, xhr){
    console.log(error);
    const errorMsg = error.responseJSON.error;
    $(errorMsg).appendTo('container');
}


$('#formDelete').validate({
    rules: {
        email: {
            required: true,
            email: true
        },
    },
    messages: {
        email: {
            required: 'Please inform email to delete.',
            minlength: 'Please inform a valid email.'
        },
    },
    SubmitHandler: deleteUsers
});