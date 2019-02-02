const BASE_URL = 'https://us-central1-itfighters-movies.cloudfunctions.net/';
var myMoviesTab = [];

window.onload = function () {
    $('#closePopup').on('click', function () {
        $('#popoupWindow').addClass('hiddenDetails');

    });

    $('#form').keypress(function (event) {
        if (event.keyCode == 13) {
            createMovie();
        }
    });

    $('#nav').keypress(function (event) {
        if (event.keyCode == 13) {
            searchMovie();
        }
    });

}

downloadData();

function downloadData() {
    fetch(BASE_URL + 'api/movie')
        .then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject(resp)
            }
        })
        .then(respJson => {
            myMoviesTab = respJson;
            generateAllMovies(respJson);

        })
        .catch(error => alert('Wystąpił błąd z połączeniem'))
}

function generateAllMovies(allMovies) {
    $('#moviesList').html('');
    var movies = '';
    for (let index = 0; index < allMovies.length; index++) {

        var movie = allMovies[index];

        movies += `<article  data-movieId="${movie.id}"> Tytuł: ${movie.title}<br /> Rok: 
        ${movie.year}<br /> Ocena: 
         ${movie.rate}<br /> 
         <img src="${movie.imgSrc}" /> <br />
         <button class="delete-movie" data-movieId="${movie.id}">Delete</button><br />
        </article > `

    }
    var list = $(movies);
    $('#moviesList').append(list);

    $('.delete-movie').on('click', function (event) {
        event.stopPropagation();
        var $deleteButton = $(this);
        var buttonData = $deleteButton.data();
        console.log(buttonData);

        fetch(BASE_URL + '/api/movie/' + buttonData.movieid, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            .then(response => {
                return response.text();
            })
            .then(resp => {
                alert('Film został usunięty');
                downloadData();
            })
            .catch(error => {
                console.log(error);
                alert('Wystąpił błąd połączenie, spróbuj ponownie później');
            })
    });

    $('article').on('click', function () {
        var $article = $(this);
        var articleData = $article.data();

        fetch(BASE_URL + '/api/movie/' + articleData.movieid)
            .then(resp => {
                return resp.json();
            })
            .then(respJson => {
                $('#detailsTitle').text(respJson.title);
                $('#detailsYear').text(respJson.year);
                $('#detailsRate').text(respJson.rate);

                $('#authorsList').html('');
                for (var i = 0; i < respJson.cast.length; i++) {
                    var element = respJson.cast[i];
                    var $li = $('<li>' + element + '</li>')
                    $('#authorsList').append($li);
                }

                $('#genresList').html('');
                for (var i = 0; i < respJson.genres.length; i++) {
                    var element = respJson.genres[i];
                    var $li = $('<li>' + element + '</li>')
                    $('#genresList').append($li);
                }

                $('#detailsDescription').text(respJson.description);
                $('#detailsImage').attr('src', respJson.imgSrc);

            })
            .catch(error => console.log(error));


        $('#popoupWindow').removeClass('hiddenDetails');
    })
};

function showMovie() {
    var filteredMovie = searchMovie(myMoviesTab);
    generateAllMovies(filteredMovie);
}

function searchMovie(allMovies) {
    var searchMovieTab = [];
    var searchPhrase = $('#movie').val().toLowerCase();
    for (let index = 0; index < allMovies.length; index++) {
        var movie = allMovies[index];
        var movieTitle = movie.title.toLowerCase();
        if (movieTitle.indexOf(searchPhrase) != -1) {
            searchMovieTab.push(movie);
        }
    }
    return searchMovieTab;
}

function addMovie() {
    createMovie();
    $('.formInput').val('');

}

function createMovie() {

    var newMovie = {};

    newMovie.title = $('#title').val();
    newMovie.year = $('#year').val();
    newMovie.rate = $('#rate').val();
    newMovie.cast = $('#cast').val().split(',');
    newMovie.genres = $('#genres').val().split(',');
    newMovie.description = $('#description').val();
    newMovie.imgSrc = $('#image').val();

    var isValid = formValidate();
    if (!isValid) {
        return;
    }

    fetch("https://us-central1-itfighters-movies.cloudfunctions.net/api/movie", {
        method: 'post',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(newMovie)
    })
        .then(resp => {
            if (resp.ok) {
                downloadData();
            }
        })
        .catch(error => {
            alert('nie udało się dodać')
        })

}

function formValidate() {
    var isValid = true;

    var title = $('#title').val();
    if (title == '') {
        alert('Proszę podać tytuł');
        isValid = false;
    }

    var year = $('#year').val();
    if (year == '') {
        alert('Proszę podać rok');
        isValid = false;
    }

    var rate = $('#rate').val();
    if (rate == '') {
        alert('Proszę podać ocenę');
        isValid = false;
    }

    var cast = $('#cast').val();
    if (cast == '') {
        alert('Proszę podać obsadę');
        isValid = false;
    }

    var genres = $('#genres').val();
    if (genres == '') {
        alert('Proszę podać rodzaj');
        isValid = false;
    }

    var description = $('#description').val();
    if (description == '') {
        alert('Proszę podać opis');
        isValid = false;
    }

    var image = $('#image').val();
    if (image == '') {
        alert('Proszę dodać zdjęcie');
        isValid = false;
    }

    return isValid;
}


