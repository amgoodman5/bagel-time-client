$(document).ready(function() {

    const location = returnLocation(window.location.pathname);
    generatePage(location);
    generateStaticEventHandlers();

});
let serverURL = "";

function generatePage(location) {
    serverURL = returnEnvironment();

    if (location === "inspect-user") {
        const pageId = getPageId().id;
        $.getJSON(`${serverURL}/user/${pageId}`)
            .then((data) => {
                let parent = $(`.form-container`);
                const source = $(`#inspect-user-form`).html();
                const template = Handlebars.compile(source);
                const html = template(data);
                parent.append(html)

            })
            .catch((err) => {
                console.log(err)
            });
    } else {
        $.getJSON(`${serverURL}/${location}`)
            .then((data) => {
                let parent = $(`.${location}-table`);
                data.forEach((element) => {
                    const source = $(`#${location}-table`).html();
                    const template = Handlebars.compile(source);
                    const html = template(element);
                    parent.append(html)
                    generateClickHandler(location, element.id);
                });

            })
            .catch((err) => {
                console.log(err)
            });

    }

} //where to generate the page



function returnLocation(pathname) {
    let location = pathname.replace(".html", "");
    if (location === '/') {
        location = 'user'
    } else {
        location = location.replace("/", "");
        if (location === "index") {
            location = "user"
        }
    }

    return location;

}

function returnEnvironment() {
    if (window.location.hostname === "localhost") {
        return "http://localhost:3000"
    } else {
        return "https://bageltime.herokuapp.com"
    }
};

function generateClickHandler(location, id) {
    $(`#${location}-${id}`).click(() => {
        window.location.href = `inspect-user.html?id=${id}`;
    });
}

function getPageId() {
    const qString = window.location.search;
    const groupSplitArray = qString.replace("?", "").split("&");

    const returnObject = groupSplitArray.reduce((acc, insideQuery) => {
        const insideArray = insideQuery.split("=");
        return Object.assign(acc, {
            [insideArray[0]]: insideArray[1]
        })
    }, {});
    return returnObject;
}

function generateStaticEventHandlers() {
    const id = getPageId().id;
    $("#delete-user").click(() => {
        $.ajax({
            url: `${serverURL}/user/${id}`,
            type: "DELETE",
            success: function(result) {
                alert(`Successfully inactivated the user with ID ${id}`);
                window.location.href = "index.html";
            }

        });
    });
    $("#back-to-summary").click(() => {
        window.location.href = "index.html";
    });

    $("#save-user-changes").click(() => {
      const bodyObject = {
        email: $(`#email`).val(),
        date: $(`#date`).val(),
        is_active: $(`#is_active`).val()
      }

      $.ajax({
          url: `${serverURL}/user/${id}`,
          type: "PUT",
          data: bodyObject,
          success: function(result) {
              alert(`Successfully updated the user with ID ${id}`);
              window.location.href = "index.html";
          }
      });
    });

}
