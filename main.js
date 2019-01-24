const BASE_URL = 'https://us-central1-itfighters-movies.cloudfunctions.net/';
var myMoviesTab = [];

fetch("https://us-central1-itfighters-movies.cloudfunctions.net/api/movie")
    .then(resp => {
        if (resp.ok) {
            return resp.json()
        } else {
            return Promise.reject(resp)
        }
    })
    .then(respJson => {
        myMoviesTab = respJson
        generateAllMovies(respJson)

    })
    .catch(error => alert('Wystąpił błąd z połączeniem'))



function generateAllMovies(allMovies) {
    $('#moviesList').html('');
    var movies = '';
    for (let index = 0; index < allMovies.length; index++) {
        var movie = allMovies[index];
        movies += `<article>${movie.title}<br />
        ${movie.year}<br />
         ${movie.rate}<br /> 
         <img src="${movie.imgSrc}" /> <br />
         </article > `
    }
    var list = $(movies);
    $('#moviesList').append(list);
};

function showMovie() {
    searchPhrase();
}

function searchPhrase() {
    for (let index = 0; index < allMovies.length; index++) {
        var movie = allMovies[index];
        for (title in movie) {
            if($(movie).val()==title){
               
            }

        }
    }
}
//     var searchPhrase = $('#movie').val();
//     alert(searchPhrase);
//     console.log(myMoviesTab)
// }
