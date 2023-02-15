async function getTrendingMoviesPreview(){
    const res=await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key='+API_KEY);
    const data = await res.json();

    const movies =data.results;//results es el objeto que devuelve la api

    movies.forEach(movie => {

        const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList')//ubica el id y la clase 

        const movieContainer = document.createElement('div');//crea un div
        movieContainer.classList.add('movie-container');//asigna el div a la clase movie-container
    
        const movieImg = document.createElement('img');//crea un img
        movieImg.classList.add('movie-img');//asigna el img a la clase movie-img
        movieImg.setAttribute('alt', movie.title); //asigna el atributo alt obteniendolo de movie.title al img
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/'+ movie.poster_path); //asigna el atributo src con la url base + el codigo de imagen (poster_patch) al img

        movieContainer.appendChild(movieImg); //crea un hijo (movieImg) a moviecontainer
        trendingPreviewMoviesContainer.appendChild(movieContainer); //crea un hijo (movieContainer) a trendingPreviewMoviesContainer
       
    });
}
////////////////////////////////////////////////////////////////////////////////////
async function getCategoriesPreview(){
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key='+API_KEY);
    const data = await res.json();

    const categories = data.genres; //genres es el objeto que devuelve la api

    categories.forEach(category => {

        const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')//ubica el id y la clase 

        const categoryContainer = document.createElement('div');//crea un div
        categoryContainer.classList.add('category-container');//asigna el div a la clase category-container
    
        const categoryTitle = document.createElement('h3');//crea un h3
        categoryTitle.classList.add('category-title');//asigna el h3 a la clase category-title
        categoryTitle.setAttribute('id', 'id' + category.id); //asigna al atributo id el resultado del objeto category.title: id="id28"

        const categoryTitleText = document.createTextNode(category.name);//asinga el nombre del titulo a categoryTitleText

        categoryTitle.appendChild(categoryTitleText);// crea un hijo a  categoryTitle
        categoryContainer.appendChild(categoryTitle); // crea un hijo a  categoryContainer
        previewCategoriesContainer.appendChild(categoryContainer); // crea un hijo a  previewCategoriesContainer

    });
}


getTrendingMoviesPreview();
getCategoriesPreview();