$(document).ready(() => {
    const post = $.get('http://localhost:3030/retrieveTables');
    console.log('Doc ready');
    post.done(buildPlayerTable);
});

$("#FilterName").on("keyup", function() {
    var inputValue = $(this).val().toLowerCase();
    $("#resultsTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(inputValue) > -1)
    });
})


function buildPlayerTable(rows, status, xhr) {
    

    console.log("Data sent to server");
    let resultsTable = `
    <table id="resultsTable" class="table">
    <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Position</th>
            <th scope="col">Team</th>
        </tr>
    </thead>
    <tbody id='tableBody1'>
    </tbody>
    </table>`;
    $(resultsTable).appendTo('#playerTable');
    for (let i = 0; i < rows.length; i++) {
        const trId = `tr${rows[i].player_id}`;
        $(`<tr id='${trId}'></tr>`).appendTo('#tableBody1');
        $(`<td> ${rows[i].player_id}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].p_name}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].p_position}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].p_team}</td>`).appendTo(`#${trId}`);
        $(`<td><a id='Add${trId}' class='btn btn-link'>Add</a></td>`).appendTo(`#${trId}`);

        $(`#Add${trId}`).click(addPlayer);

    }

    ready();
    
}


function ready(){
    const post = $.get('http://localhost:3030/retrieveTeam');
    console.log('Doc ready');
    post.done(buildTeamTable);
}

function buildTeamTable(rows, status, xhr) {
     console.log("Data sent to server 1");
    let fullTeamTable = `
    <table id="fullTeamTable" class="table">
    <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Position</th>
        </tr>
    </thead>
    <tbody id='tableBody'>
    </tbody>
    </table>`;
    $(fullTeamTable).appendTo('#teamTable');
    for (let i = 0; i < 11; i++) {
        const trId = `tr${rows[i].player_id}`;
        $(`<tr id='${trId}'></tr>`).appendTo('#tableBody');
        $(`<td> ${rows[i].player_n}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].player_p}</td>`).appendTo(`#${trId}`);
        $(`<td><a id='remove${trId}' class='btn btn-link'>Remove</a></td>`).appendTo(`#${trId}`);

        $(`#remove${trId}`).click(removePlayer);

    }
}

function addPlayer() {
    const element = this.parentElement.parentElement;
    const data = {
        player_n: element.children[1].innerText,
        player_p: element.children[2].innerText
    }
    const post = $.post('http://localhost:3030/addPlayer', data);
    post.done(processSuccess);
    post.fail(processUserErrors);
}

function removePlayer() {
    
    const element = this.parentElement.parentElement;
    const data = {
        player_n: element.children[0].innerText,
    }
    const post = $.post('http://localhost:3030/removePlayer', data);
    post.done(processSuccess);
    post.fail(processUserErrors);
}

function processUserErrors(error, status, xhr) {
    console.log(error);
    const errorMsg = error.responseJSON.error;
    $(`<div class='alert alert-danger'>${errorMsg}</div>`).appendTo('.container');
}

function processSuccess(rows, status, xhr) {
    $('#fullTeamTable').remove();
    buildTeamTable(rows, status, xhr);
}

function processFilter(rows, status, xhr) {
    console.log(rows);
    console.log(rows.length);
    buildPlayerTable(rows, status, xhr);
    buildTeamTable(rows, status, xhr);
}
