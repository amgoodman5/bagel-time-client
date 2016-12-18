$(document).ready(function() {

    const location = returnLocation(window.location.pathname);
    generatePage(location);

});
let serverURL = "";

function generatePage(location) {
    serverURL = returnEnvironment();

    $.getJSON(`${serverURL}/${location}`)
        .then((data) => {
            let parent = $(`.${location}-table`);
            data.forEach((element) => {
                const source = $(`#${location}-table`).html();
                const template = Handlebars.compile(source);
                const html = template(element);
                parent.append(html)
                generateClickHandler()
            });

        })
        .catch((err) => {
            console.log(err)
        });

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
