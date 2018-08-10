
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").prepend
            (`<div class="gray-blue dark-blue-text font3 padding">
            <p class="padding" data-id="${data[i]._id}">
            <h3 class="padding">${data[i].title}</h3>
            <h5>Published: ${data[i].time}</h5>
            <h4>${data[i].summary}</h4>
            <a href="${data[i].link}" target="_blank">Read Full Article</a>
            <button class="comments font3" data-id="${data[i]._id}">Comments</button>
            </p>
            </div>`)
    }
});

$(document).on("click", "#scrape", function () {
    
    console.log("scrape")
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        location.reload()
    })
})

$(document).on("click", ".comments", function () {
    // Empty the notes from the note section

    $("#notes").empty();
    //$("#notes").append("<h1>it worketh!</h1>")
    var thisId = $(this).attr("data-id");
    //$("#notes").append(`<h1>${thisId}</h1>`)


    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append(
                `<div class="notes sticky font3 eggshell">
                <h1 class="center">Enlightening Commentary</h1>
                <h2>"${data.title}"</h2>
                <h4>Title: <input class='center' id='titleinput' name='title' placeholder='ANGRY WORDS'></h4>
                <h4>Author: <input class='center' id='authorinput' name='author' placeholder='Rush Limbaugh'></h4>
                <h4>Comment: <textarea rows="4" cols="50" class='center' id='bodyinput' name='body' placeholder='Compassionate, well-thought-out commentary.'></textarea></h4>
                <button data-id='${data._id}' id='savenote'>Submit</button>
                </div>
                `
            )

            // If there's a note in the article
            if (data.note) {
                $("#notes").append(
                    `<h4>${data.note.title}</h4>
                    <h4>${data.note.author}</h4>
                    <h4>${data.note.body}</h4>
                    `
                )
                // // Place the title of the note in the title input
                // $("#titleinput").val(data.note.title);
                // $("#authorinput").val(data.note.author)
                // // Place the body of the note in the body textarea
                // $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    //console.log(`THIS IS IT ${thisId}`)

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            author: $("#authorinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            //$("#notes").empty();
        });

    // // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    // $("#authorinput").val("");
    // $("#bodyinput").val("");
});