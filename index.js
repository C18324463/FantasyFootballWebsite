
$(document).ready(() => {
    const post = $.get('http://localhost:3030/retrieveData');
    console.log('Doc ready');
    post.done(buildStatsTable);
    post.fail(displayError);
});


function buildStatsTable(rows, status, xhr) {
    
    console.log("Data sent to server");
    let resultsTable = `
    <table id="resultsTable" class="table">
    <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Position</th>
            <th scope="col">Team</th>
            <th scope="col">Form</th>
            <th scope="col">Points</th>
    
        </tr>
    </thead>
    <tbody id='tableBody'>
    </tbody>
    </table>`;
    $(resultsTable).appendTo('#colTable');
    for (let i = 0; i < rows.length; i++) {
        const trId = `tr${rows[i].player_id}`;
        $(`<tr id='${trId}'></tr>`).appendTo('#tableBody');
        $(`<td> ${rows[i].player_id}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].p_name}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].p_position}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].p_team}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].p_form}</td>`).appendTo(`#${trId}`);
        $(`<td> ${rows[i].p_points}</td>`).appendTo(`#${trId}`);

    }
    
}

function displayError(response, status, xhr) {
    console.log(response);
    const errors = response.responseJSON.errors;
    for (let i = 0; i < errors.length; i++) {
        $(`<div>${JSON.stringify(errors[i])}</div>`).appendTo('.container');
    }
}