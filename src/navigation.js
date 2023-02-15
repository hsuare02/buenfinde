let maxPage;
let page = 1; 
let infiniteScroll;


searchFormBtn.addEventListener('click', ()=>{
    location.hash='#search='+ searchFormInput.value ;
});
trendingBtn.addEventListener('click', ()=>{
    location.hash='#trends';
});
arrowBtn.addEventListener('click', ()=>{
    window.history.back(); //sirve para que cuando se devuelva la flecha se obtenga la ultima busqueda realizada
    // location.hash='#home';
});

window.addEventListener('DOMContentLoaded',navigator, false); //funcion que permite cargar el hash cuando abre el navegador y a su vez ejecutar la funcion navigator cada vez que ocurre

window.addEventListener('hashchange',navigator, false); //funcion que permite escuchar eventos de cambios de hash y a su vez ejecutar la funcion navigator cada vez que ocurre
//llamar a la función cuando se realice scroll
window.addEventListener('scroll', infiniteScroll, false);


function navigator(){
    console.log({location});

    //si infiniteScroll tiene algun valor lo quito
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false });
        // Passive lo que hace es evitar el llamado de preventDefault() en el caso de que este existiese en la función llamada por el Listener. En los navegadores que usa la gente normal el valor por defecto es false por lo que no se aplica, pero en el caso de Safari e Internet Explorer el valor por defecto es true. Por lo que es recomendable ponerle un valor para que el código se ejecute igual en todos los navegadores. El preventDefault cancela el evento, lo que significa que cualquier acción por defecto que deba producirse como resultado de este evento, no ocurrirá

        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')){
        trendsPage();
    } else if (location.hash.startsWith('#search=')){
       searchPage();
    }else if (location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }else if (location.hash.startsWith('#category=')){
        categoriesPage();
    }else {
        homePage();
    }

    window.scrollTo(0, 0); //para que se haga scrroll al principio de la pagina en cada navegacion
    
    //vuelve a preguntar, si  infiniteScroll ya tiene algun valor entonces si llama al scrol infinito
    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false });
    }
}
//location.hash //lee el hash de la pagina
//para cambiarse en consola de hash --> location.hash= '#trends'

function homePage(){

    headerSection.classList.remove('header-container--long');
    headerSection.style.background= '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow-white'); //css  header-arrow-white
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    console.log('Home!!!!');
    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}
function categoriesPage(){

    headerSection.classList.remove('header-container--long');
    headerSection.style.background= '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow-white'); //css  header-arrow-white
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

 
    //destrcuturar array...a la posicion 0 y 1 se le asigna nombres
    //ejemplo location.hash =>category=36-History' --> ['#category', 'id-name']--> [_,categoryData] -->
    const [_,categoryData]= location.hash.split('=') ;//separa por el igual
    const [categoryId, categoryName]=categoryData.split('-');//repara por el guion

    headerCategoryTitle.innerHTML= categoryName;//actualiza el nombre de cada categoria en pantalla de peliculas x categoria
    
    getMoviesByCategory(categoryId);
    console.log('Categories!!!!!');

    infiniteScroll= getPaginatedMoviesByCategory(categoryId);
}
function movieDetailsPage(){

    headerSection.classList.add('header-container--long');
    //headerSection.style.background= '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white'); //css  header-arrow--white
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    console.log('movie details!!!!!!!!!!');

    //['#movie','1223234']
    const [_,movieId]= location.hash.split('=') ;//separa por el igual
    getMovieById(movieId);
}
function searchPage(){
    console.log('search page!!!!!!!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background= '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow-white'); //css  header-arrow-white
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    //['#search','loqueestasbuscando']
    const [_,query]= location.hash.split('=') ;//separa por el igual
    getMoviesBySearch(query);

    infiniteScroll= getPaginatedMoviesBySearch(query);
}
function trendsPage(){
    console.log('trends Page!!!!!!!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background= '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow-white'); //css  header-arrow-white
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML= 'Tendencias';
    getTrendingMovies();

    infiniteScroll= getPaginatedTrendingMovies;
}


