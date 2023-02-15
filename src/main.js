//API peliculas: https://developers.themoviedb.org/3/movies/get-movie-details

//DATA

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    // opcional: 'Content-Type'
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

//funcion Like

//Peliculas que ya me gustaron:
function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;

  if (item) {
    movies = item; // si ya fue guardado devuelve la pelicula guardada
  } else {
    movies = {}; //si no hay nada devuelve objeto vacio
  }
  
  return movies;
}

//agregar o quitar peliculas
function likeMovie(movie) {
  // movie.id
  const likedMovies = likedMoviesList();

  console.log(likedMovies);

  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined; //remover de Local Storage "liked_movies"
  } else {
    likedMovies[movie.id] = movie;//agregar a local Storage "liked_movies"
  }
  //agrega local storage liked_movies el objeto anterior movie.id
  localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

  //ver en consola resultado del local storage: localStorage.getItem('liked_movies');
}



// Utils

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

function createMovies(
  movies,
  container,
  { lazyLoad = false, clean = true } = {}
) {
  if (clean) {
    container.innerHTML = "";
  }

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div"); //crea un div
    movieContainer.classList.add("movie-container"); //asigna el div a la clase movie-container


    const movieImg = document.createElement("img"); //crea un img
    movieImg.classList.add("movie-img"); //asigna el img a la clase movie-img
    movieImg.setAttribute("alt", movie.title); //asigna el atributo alt obteniendolo de movie.title al img

    //si lazyLoad es true asigna el atributo data-img la url de la imagen, esto de forma temporal para que no cargue todas a la vez sino a medida que el lazyLoader lo muestre y asigne al atributo src
    //si lazyload esta apagado entonces que carguen todas las imagenes es decir que se asigne directamente el tag src
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );

        
    movieImg.addEventListener("click", () => {
    location.hash = "#movie=" + movie.id;
    });

    //si ocurre un error al cargar la imagen, entonces carga la de defecto
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute(
        "src",
        "https://static.platzi.com/static/images/error/img404.png"
      );
    });

    const movieBtn = document.createElement('button');
    movieBtn.classList.add('movie-btn');
    
    //valida sí el local storage likedMoviesList tiene el id de la pelicula guardado: si es vdd agrego la clase movie-btn--liked si no no hace nada
    likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
    movieBtn.addEventListener('click', () => {
      movieBtn.classList.toggle('movie-btn--liked');
      likeMovie(movie);
      getLikedMovies();
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg); //crea un hijo (movieImg) a moviecontainer
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer); //crea un hijo (movieContainer) a trendingPreviewMoviesContainer
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div"); //crea un div
    categoryContainer.classList.add("category-container"); //asigna el div a la clase category-container

    const categoryTitle = document.createElement("h3"); //crea un h3
    categoryTitle.classList.add("category-title"); //asigna el h3 a la clase category-title
    categoryTitle.setAttribute("id", "id" + category.id); //asigna al atributo id el resultado del objeto category.title: id="id28"

    categoryTitle.addEventListener("click", () => {
      location.hash = "#category=" + category.id + "-" + category.name;
    });

    const categoryTitleText = document.createTextNode(category.name); //asinga el nombre del titulo a categoryTitleText

    categoryTitle.appendChild(categoryTitleText); // crea un hijo a  categoryTitle
    categoryContainer.appendChild(categoryTitle); // crea un hijo a  categoryContainer
    container.appendChild(categoryContainer); // crea un hijo a  previewCategoriesContainer
  });
}

//llamados a la API

async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");
  const movies = data.results; //data es el objeto que por defecto devuelve axios y results el objeto que devuelve la api

  createMovies(movies, trendingMoviesPreviewList, true);
}


async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list");
  const categories = data.genres; //genres es el objeto que devuelve la api

  createCategories(categories, categoriesPreviewList);
}
////////////////////
async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  }); //https://developers.themoviedb.org/3/discover/movie-discover

  const movies = data.results; //data es el objeto que por defecto devuelve axios y results el objeto que devuelve la api
  
  maxPage=data.total_pages;
  createMovies(movies, genericSection, {lazyLoad:true});
}

function getPaginatedMoviesByCategory(id) {

    return async function (){
        const {
            scrollTop,
            scrollHeight,
            clientHeight
          } = document.documentElement;
          
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        
        const pageIsNotMax = page < maxPage; 
    
        if (scrollIsBottom && pageIsNotMax) {
          page++;
          const { data } = await api("discover/movie", {
            params: {
              with_genres: id,
              page,
            },
          }); //https://developers.themoviedb.org/3/discover/movie-discover

          const movies = data.results;

          createMovies(movies, genericSection, {
            lazyLoad: true,
            clean: false,
          });
        }
    }

  
}



// >>>>>>>>>>>>>>>>>>>>>>>estoy trabajando aqui 1
async function getMoviesBySearch(query) {
  const { data } = await api('search/movie', {
    params: {
      query,
    },
  });

  const movies = data.results; //data es el objeto que por defecto devuelve axios y results el objeto que devuelve la api
  maxPage = data.total_pages;
  console.log(maxPage);
  createMovies(movies, genericSection);
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>estoy trabajando aqui 2
function getPaginatedMoviesBySearch(query) {

    return async function (){
        const {
            scrollTop,
            scrollHeight,
            clientHeight
          } = document.documentElement;
          
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        
        const pageIsNotMax = page < maxPage; 
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('search/movie', {
              params: {
                query,
                page,
    
              },
            });
    
    
            const movies = data.results;
    
    
        
            createMovies(
              movies,
              genericSection,
              { lazyLoad: true, clean: false },
            );
          }
    }

  
}




async function getTrendingMovies() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  maxPage = data.total_pages;

  //console.log(data.total_pages);//devuelve total de paginas de la respuesta de la api

  createMovies(movies, genericSection, { lazyLoad: true, clean: true }); //clean: true para que la primera vez si limpie el navegador

 
  //boton
  //   const btnLoadMore = document.createElement("button");
  //   btnLoadMore.innerText = "Cargar más";
  //   btnLoadMore.addEventListener("click", getPaginatedTrendingMovies);
  //   genericSection.appendChild(btnLoadMore);
}

//funcion que realiza el scroll infinito de llamadas
async function getPaginatedTrendingMovies() {
 
    const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = document.documentElement;
      
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
    const pageIsNotMax = page < maxPage; 


    
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/day', {
          params: {
            page,
          },
        });
        const movies = data.results;


    
        createMovies(
          movies,
          genericSection,
          { lazyLoad: true, clean: false },
        );
      }
    
      //boton
      // const btnLoadMore = document.createElement('button');
      // btnLoadMore.innerText = 'Cargar más';
      // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
      // genericSection.appendChild(btnLoadMore);

  
}

async function getMovieById(id) {
  //axios devuelve objeto data y lo renombro a movie
  const { data: movie } = await api("movie/" + id);

  const movieImgUrl = "https://image.tmdb.org/t/p/w500/" + movie.poster_path; //w500 es el tamaño de la imagen
  //degaradar imagen (para mejorar vision) y cargar url al css
  headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
    `;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);

  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}

//para corregir error de categorias con espacio (no se donde ponerlo jaja)
// movieContainer.addEventListener('click',() =>
// location.hash = `#movie=${movie.id}-${movie.title.split(' ').join('')}`);

function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies); //Object.values crea un array con los valores del objeto

  createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true });
  
  console.log(likedMovies)
}
