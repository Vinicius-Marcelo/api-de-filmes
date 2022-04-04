const root = document.querySelector(`body`);
const btnTheme = document.querySelector(`.btn-theme`);
const btnPrev = document.querySelector(`.btn-prev`);
const btnNext = document.querySelector(`.btn-next`)
let movies = document.querySelector(`.movies`);
const input = document.querySelector(`.input`);
const hidden = document.querySelector(`.hidden`);

const highLightInfo = document.querySelector(`.highlight__info`);
const highLightVideo = document.querySelector(`.highlight__video`);
const highLightTitle = document.querySelector(`.highlight__title`);
const highLightRating = document.querySelector(`.highlight__rating`);
const highLightGenres = document.querySelector(`.highlight__genres`);
const highLightLaunch = document.querySelector(`.highlight__launch`);
const highLightDescription = document.querySelector(`.highlight__description`);
const highLightVideoLink = document.querySelector(`.highlight__video-link`);

const modal = document.querySelector(`.modal`);
const modalTitle = document.querySelector(`.modal__title`);
const modalVideo = document.querySelector(`.modal__video`);
const modalDescription = document.querySelector(`.modal__description`);
const modalAverage = document.querySelector(`.modal__average`);
const modalGenreAverage = document.querySelector(`.modal__genre-average`);
const modalGenres = document.querySelector(`.modal__genres`);
const modalClose = document.querySelector(`.modal__close`);
const modalVideoLink = document.querySelector(`.modal__video-link`);

let moviesArray = [];
let transition = ((168 + 24) * 5);
let pagination = 0;
let light = false;

const createElements = (element) => {
    const divMovie = document.createElement(`div`);
    divMovie.classList.add(`movie`);
    divMovie.style.backgroundImage = (!element.poster_path) ? 'url(https://via.placeholder.com/320?text=sem+foto)' : `url(${element.poster_path})`;
    divMovie.id = element.id;
    const divInfo = document.createElement(`div`);
    divInfo.classList.add(`movie__info`);
    const movieImage = document.createElement(`img`);
    movieImage.src = (`./assets/estrela.svg`);
    const movieTitle = document.createElement(`span`);
    movieTitle.classList.add(`movie__title`);
    movieTitle.textContent = element.title;
    const movieAverage = document.createElement(`span`);
    movieAverage.classList.add(`movie__rating`);
    movieAverage.textContent = element.vote_average;
    movieAverage.append(movieImage);
    divInfo.append(movieTitle, movieAverage);
    divMovie.append(divInfo);
    movies.append(divMovie);
}

const showMovies = async () => {
    const url = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false`);
    const promiseBody = url.json();
    const body = await promiseBody;
    moviesArray = body.results;
    movies.innerHTML = ``;
    moviesArray.forEach(element => {
        createElements(element);
    });
    createModal();
};

btnPrev.addEventListener(`click`, () => {
    if (pagination === 0) { return; }
    pagination -= 1;
    for (let i of movies.children) {
        i.style.transform = `translate(-${transition * pagination}px, 0)`;
    }
});

btnNext.addEventListener(`click`, () => {
    pagination = (pagination + 1) % (Math.round(moviesArray.length / 5));
    for (let i of movies.children) {
        i.style.transform = `translate(-${transition * pagination}px, 0)`;
    }
});

const searchMovies = input.addEventListener(`keydown`, async (event) => {
    if (event.key !== `Enter`) return;
    if (input.value === ``) return showMovies();
    const url = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);
    const promiseBody = url.json();
    const query = await promiseBody;
    moviesArray = query.results;
    movies.innerHTML = ``;
    moviesArray.forEach(element => {
        createElements(element);
    });
    createModal();
    input.value = ``;
});

const movieOfTheDay = async () => {
    const url = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR`);
    const promiseBody = url.json();
    const body = await promiseBody;
    const genres = [];
    for (let i = 0; i < body.genres.length; i++) {
        genres.push(body.genres[i].name);
    };
    const dateLounch = new Date(body.relaese_date);
    highLightVideo.style.backgroundImage = `url(${body.backdrop_path})`;
    highLightTitle.textContent = body.title;
    highLightRating.textContent = body.vote_average;
    highLightGenres.textContent = genres.join(`, `);
    highLightLaunch.textContent = dateLounch.toLocaleString(`pt-BR`, { year: 'numeric', month: 'long', day: 'numeric' });
    highLightDescription.textContent = body.overview;
};

const changeTheme = btnTheme.addEventListener(`click`, () => {
    const newBackgroundColor = root.style.getPropertyValue(`--background-color`) === `#414141` ? `#fff` : `#414141`;
    root.style.setProperty(`--background-color`, newBackgroundColor);
    const newColorText = root.style.getPropertyValue(`--color`) === `#fff` ? `#000` : `#fff`;
    root.style.setProperty(`--color`, newColorText);
    btnPrev.src = light ? `./assets/seta-esquerda-preta.svg` : `./assets/seta-esquerda-branca.svg`;
    btnNext.src = light ? `./assets/seta-direita-preta.svg` : `./assets/seta-direita-branca.svg`;
    light = !light;

    const newBackgroundHighLightInfo = highLightInfo.style.getPropertyValue(`--highlight-background`) === `#414141` ? `#fff` : `#414141`;
    highLightInfo.style.setProperty(`--highlight-background`, newBackgroundHighLightInfo);
    const newColorTextHighLightInfo = highLightInfo.style.getPropertyValue(`--highlight-color`) === `#fff` ? `#000` : `#fff`;
    highLightInfo.style.setProperty(`--highlight-color`, newColorTextHighLightInfo);
    const newColorDescriptionHighLightInfo = highLightInfo.style.getPropertyValue(`--highlight-description`) === `#fff` ? `#000` : `#fff`;
    highLightInfo.style.setProperty(`--highlight-description`, newColorDescriptionHighLightInfo);
});

const createModal = () => {
    const movies = document.querySelectorAll(`.movie`);
    movies.forEach(movie => {
        movie.addEventListener(`click`, async () => {
            const modalLinkId = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movie.id}?language=pt-BR`);
            const promiseBody = modalLinkId.json();
            const body = await promiseBody;
            modalVideo.id = body.id;
            while (modalGenres.firstChild) {
                modalGenres.removeChild(modalGenres.firstChild);
            };
            modalTitle.textContent = body.title;
            modalVideo.style.backgroundImage = `url(${body.backdrop_path})`;
            modalDescription.textContent = body.overview;
            modalAverage.textContent = body.vote_average;
            body.genres.forEach(element => {
                const modalSpan = document.createElement(`span`);
                modalSpan.classList.add(`modal__genre`);
                modalSpan.textContent = element.name;
                modalGenres.append(modalSpan);
            });
            modalGenreAverage.append(modalGenres, modalAverage);
            modal.classList.remove(`hidden`);
            const video = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movie.id}/videos?language=pt-BR`);
            const promiseAnswer = video.json();
            const answer = await promiseAnswer;
            const authentic = answer.results.find(iten => {
                return iten.official === true;
            });
            if (!authentic) return modalVideoLink.target = `_self`;
            modalVideoLink.href = `https://www.youtube.com/watch?v=${authentic.key}`;
        });
    });
};

modalClose.addEventListener(`click`, () => {
    modal.classList.add(`hidden`);
    modalVideoLink.href = `#`;
    modalVideoLink.target = `_blank`;
});

const passTrailer = async () => {
    const answer = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`);
    const promiseBody = answer.json();
    const body = await promiseBody;
    highLightVideoLink.href = `https://www.youtube.com/watch?v=${body.results[1].key}`;
}

window.onload = () => {
    movies.style.width = transition + `px`;
};
showMovies();
movieOfTheDay();
passTrailer();