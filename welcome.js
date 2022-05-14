const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')
const moviesList = document.getElementById('moviesList')
const watchlist = document.getElementById('watchlist')
const removeWatchlistBtn = document.getElementsByClassName('remove-watchlist-btn')
const cardWatchlistBtn = document.getElementsByClassName('watchlist-btn')
const readMore = document.getElementsByClassName('read-more')
const readMorePlot = document.getElementsByClassName('read-more-plot')
const movieKey = document.getElementsByClassName('movie-key')
const localStorageKeys = Object.keys(localStorage)

if (searchBtn) {
    searchBtn.addEventListener('click', searchMovies)
}

async function searchMovies() {
    // Hide default elements
    if (moviesList.children) {
        let children = moviesList.children
        let childrenArr = Array.prototype.slice.call(children)
        childrenArr.forEach((child) => child.remove())
    }

    let res = await fetch(`https://www.omdbapi.com/?s=${searchInput.value.trim()}&apikey=e668e570`)
    let data = await res.json()

    const movies = data.Search

    // Get and display search results
    movies.forEach(async (movie) => {
        let response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=e668e570`)
        let moviesListData = await response.json()

        const readMoreMovieID = moviesListData.imdbID + 'more'
        const hideReadMore = moviesListData.imdbID + 'hide'

        const summaryPlot = `${moviesListData.Plot.substring(0, 110)}<span id=${hideReadMore}>...<button class="black read-more" onclick="showCompletePlot(${readMoreMovieID}, ${hideReadMore})">Read more</button></span>`

        const readMorePlot = `<span class="read-more-plot" id=${readMoreMovieID} >${moviesListData.Plot.substring(110, moviesListData.Plot.length)}</span>`

        const completePlot = moviesListData.Plot
        const longPlot = summaryPlot + readMorePlot
        const movieID = moviesListData.imdbID
        const movieIDkey = moviesListData.imdbID + 'key'
        const watchlistBtnKey = moviesListData.imdbID + 'watchlistBtn'
        const removeBtnKey = moviesListData.imdbID + 'removeBtn'

        moviesList.innerHTML += `
                <div class="cards">
                    <div class="card" id=${movieID}>
                        <span id=${movieIDkey} class="hide movie-key">${movieIDkey}</span>
                        <img src=${moviesListData.Poster} class="card-poster" />

                        <div class="card-header">
                            <h2 class="card-title">${moviesListData.Title}</h2>
                            <img src="images/star-icon.svg" class="star-icon" />
                            <span class="card-rating">${moviesListData.imdbRating}</span>
                        </div>
                        
                        <div class="card-meta">
                            <span class="card-runtime">${moviesListData.Runtime}</span>
                            <span>${moviesListData.Genre}</span>

                            <button class="card-btn card-watchlist watchlist-btn" id="${watchlistBtnKey}" onclick="addToWatchlist(${movieIDkey}, ${movieID}, ${watchlistBtnKey}, ${removeBtnKey})"><img src="images/watchlist-icon.svg" alt="Add film to watchlist" class="card-watchlist-plus-icon" />&nbsp;Watchlist</button>

                            <button class="card-btn card-watchlist remove-watchlist-btn" id="${removeBtnKey}" onclick="removeFromWatchlist(${movieIDkey}, ${removeBtnKey}, ${watchlistBtnKey}, ${removeBtnKey})"><img src="images/remove-icon.svg" alt="Remove film to watchlist" class="card-watchlist-plus-icon" />&nbsp;Remove</button>
                        </div>
                        <p class="card-plot">${completePlot.length < 110 ? completePlot : longPlot}</p>
                    </div>
                </div>
            `

        displayWatchlistOrRemoveBtn()
    })
}

function displayWatchlistOrRemoveBtn() {
    for (let movie of movieKey) {
        const removeBtnID = movie.id.slice(0, 9) + 'removeBtn'
        const removeBtn = document.getElementById(removeBtnID)

        const watchlistBtnID = movie.id.slice(0, 9) + 'watchlistBtn'
        const watchlistBtn = document.getElementById(watchlistBtnID)

        localStorageKeys.forEach((key) => {
            if (movie.id === key) {
                removeBtn.style.display = 'inline'
                watchlistBtn.style.display = 'none'
            }
        })
    }
}

function showCompletePlot(readMoreMovieID, hideReadMore) {
    readMoreMovieID.style.display = 'inline'
    hideReadMore.style.display = 'none'
}

function addToWatchlist(movieIDkey, movieID, watchlistBtnKey, removeBtnKey) {
    localStorage.setItem(movieIDkey.innerHTML, movieID.innerHTML)
    watchlistBtnKey.style.display = 'none'
    removeBtnKey.style.display = 'inline'
}

function removeFromWatchlist(movieIDkey, removeBtnKey, watchlistBtnKey, removeBtnKey) {
    localStorage.removeItem(movieIDkey.innerHTML)

    // Get parent element (the movie card div) and remove it
    if (watchlist) {
        localStorage.removeItem(movieIDkey.innerHTML)

        const parentEl = document.getElementById(movieIDkey.innerHTML).parentElement
        parentEl.remove()
    }

    watchlistBtnKey.style.display = 'inline'
    removeBtnKey.style.display = 'none'

    // Display default elements if local storage empty
    if (watchlist && localStorage.length === 0) {
        if (watchlist.children) {
            const children = watchlist.children
            const childrenArr = Array.prototype.slice.call(children)
            childrenArr.forEach((child) => (child.style.display = 'flex'))
        }
    }
}

// Hide default elements if data is in local storage
if (watchlist && localStorage.length > 0) {
    if (watchlist.children) {
        const children = watchlist.children
        const childrenArr = Array.prototype.slice.call(children)
        childrenArr.forEach((child) => (child.style.display = 'none'))
    }
}

for (let i = 0; i < localStorage.length; i++) {
    const getLocalStorage = localStorage.getItem(localStorage.key(i))

    // Display every key's value to the watchlist
    if (watchlist) {
        watchlist.innerHTML += `<div class="card">${getLocalStorage}</div>`

        // Hide the 'add to watchlist' button
        for (let button of cardWatchlistBtn) {
            button.style.display = 'none'
        }

        // Display the 'remove from watchlist' button
        for (let button of removeWatchlistBtn) {
            button.style.display = 'inline'
        }
    }
}

firebase.auth().onAuthStateChanged((user)=>{
    if(!user){
        location.replace("index.html")
    }else{
        document.getElementById("user").innerHTML = "Hello, "+user.email
    }
})


function logout(){
    firebase.auth().signOut()
}
