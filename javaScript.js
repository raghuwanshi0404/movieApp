
$(document).ready(function () {
	$(window).scroll(function () {
		var scroll = $(window).scrollTop();
		if (scroll > 100) {
			$(".netflix-navbar").css("background", "#0C0C0C");
		}

		else {
			$(".netflix-navbar").css("background", "transparent");
		}
	});

})


function position(id) {
	var card = document.getElementsByClassName('card')[id];
	
	console.log(id)
}

let apiKey = "4b21e916a151c6300de98876ab9acdc0";
let apiUrl = "https://api.themoviedb.org/3";
let image_Path = "https://image.tmdb.org/t/p/original";
console.log(image_Path);

const path = {
    fetchMoviesCategories: `${apiUrl}/genre/movie/list?api_key=${apiKey}`,
    fetchMovieList: function (id) {
        return `${apiUrl}/discover/movie?api_key=${apiKey}&with_genres=${id}`
    },
    fetch_TrendingMovies: `${apiUrl}/trending/all/day?api_key=${apiKey}language=en-US`,

}

function fetch_Movies_SCategories() {
    fetch(path.fetchMoviesCategories)

        .then((response) => {
            console.log(response.status)
            console.log(response.ok)
            return response.json()
        })
        .then(response => {
            console.log(response)
        })
        .catch(err => console.error(err));
}
//trending movies Api request
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YjIxZTkxNmExNTFjNjMwMGRlOTg4NzZhYjlhY2RjMCIsInN1YiI6IjY0ODMzMjFkZTI3MjYwMDBlOGMwMDU1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iDvjgZGSuMIpSzf7M9DtglTxCdT_BopI1tkSKu8SJ9c'
    }
};
let trendingItem = [];
let wholeHTML = ''

function getCards(iArray) {
	let carouselLimit = 6;
	let startIndex = 0;
	let finalHTML = '';
	for(let x = 0; x < 3 ; x++) {
		
		let htmlString = '';
		for (let i = startIndex; i < carouselLimit; i++) {
			if(iArray[i]) {
				htmlString = htmlString +
					`<div class="card">
						<img src="${image_Path}${iArray[i].backdrop_path}" class="card-img-top" alt="...">
						<div class="card-body">
							<section class="d-flex justify-content-between">
								<div>
									<i class="bi bi-play-circle-fill card-icon"></i>
									<i class="bi bi-plus-circle card-icon"></i>
								</div>
								<div>
									<i class="bi bi-arrow-down-circle card-icon"></i>
								</div>
							</section>
							<section class="d-flex align-items-center justify-content-between">
								<p class="netflix-card-text m-0" style="color: rgb(0, 186, 0);">97% match
								</p>
								<span class="m-2 netflix-card-text text-white">Limited Series</span> <span
								class="border netflix-card-text p-1 text-white">HD</span>
							</section>
							<span class="netflix-card-text text-white">Provocative • Psychological •
							Thriller</span>
						</div>
					</div>`;
			}
			
		}
		htmlString = `<div class="carousel-item ${x == 0 ? 'active': ''}">
						<section  class="d-flex" style="">` +  
							htmlString +
						`</section>
					</div>`;
		finalHTML = finalHTML + htmlString;
		startIndex = carouselLimit;
		carouselLimit = carouselLimit + 6;
	}
	return finalHTML;
}
function trendingMovies() {
	fetch('https://api.themoviedb.org/3/trending/all/day?language=en-US', options)
		.then(response => response.json())
		.then(response => {
			trendingItem = response.results;
			let trendingNowMovies = document.getElementById('slider-box1');
			wholeHTML = 
				`<div class="container-fluid slider">` +
					getCaraouselControl('Trending') +
					`<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">` +
						getCards(trendingItem) +
					`</div>` +
				`</div>`;
			updateBanner();
			fetchAllCategories();
			//playOnHover();
		})
}

function getCaraouselControl(iCategoryName) {
	return `<section class="d-flex justify-content-between margin-right">
				<p class="text-white"> <b>${iCategoryName}</b> </p>
				<div class="">
					<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
						class="active tab-change-btn" aria-current="true" aria-label="Slide 1"></button>
					<button class="tab-change-btn" type="button" data-bs-target="#carouselExampleIndicators"
						data-bs-slide-to="1" aria-label="Slide 2"></button>
					<button class="tab-change-btn" type="button" data-bs-target="#carouselExampleIndicators"
						data-bs-slide-to="2" aria-label="Slide 3"></button>
				</div>
			</section>`;
}

// By category

function fetchAllCategories() {
    fetch(path.fetchMoviesCategories)
        // we use .json() in asynchronous & returns a promise object, json.parse in synchronous
        .then(res => res.json())
        .then(res => {
            const category = res['genres'];
            for (let i = 0; i < category.length; i++) {
                // console.log(category[i])
                fetchMoviesByCategory(path.fetchMovieList(category[i].id), category[i])

            }
			setTimeout(() => {
				let trendingNowMovies = document.getElementById('slider-box1');
				trendingNowMovies.innerHTML = wholeHTML;
				console.log(category, res)
			}, 5000);
        });

}
function fetchMoviesByCategory(url, category) {
    // console.log(url, category)
    fetch(url)
        .then(function (res) {
            return res.json()
        })
        .then(function (res) {
            // console.table(res.results);
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                fetchMoviesBySection(movies, category.name);
            }

        })

}
//another function
function fetchMoviesBySection(moviesList, categName) {
    console.log(moviesList, categName);
    wholeHTML = wholeHTML +
				`<div class="container-fluid">` +
					getCaraouselControl(categName) +
					`<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">` +
						getCards(moviesList) +
					`</div>` +
				`</div>`;

};


function initialize(){
    fetchAllCategories()
}

window.addEventListener('load', function () {
    trendingMovies()
    // initialize()
})


// function for Banner
function updateBanner() {
    let counter = 1;
    // let banner = document.getElementById('video-section');
    let banner = document.getElementById('video-section');
    // banner.innerHTML = `<img src="${image_Path}${trendingItem[0].backdrop_path}">`;
    // setTimeout(function() {
    playVideo(trendingItem[counter].id)
        .then(resp => resp.json())
        .then(resp => {
            console.log(trendingItem[counter]);
            console.log(resp);
            console.log( resp.results[0].key);
			let content = document.getElementById('video-section-content')
				content.innerHTML = `<section class="left">
					<div class="title">${trendingItem[counter].original_title}</div>
					<div class="title-description">${trendingItem[counter].overview}</div>
					<div class="d-flex mt-2">
						<button class="btn btn-light m-2"> <i class="bi bi-play-fill"
								style="color: black; padding: 0%;"></i> Play
							Now </button>
						<button class="btn btn-secondary m-2"><i class="bi bi-info-circle"
								style=" padding: 0%;"></i> More
							Info</button>
					</div>
				</section>`
            // updateBannerDetail(trendingItem[counter]);
            banner.innerHTML = `<iframe style="margin-left: -50%" width="200%" height="600" src="https://www.youtube.com/embed/${resp.results[0].key}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        })
    // }, 15000)
    setInterval(function () {
        counter = counter + 1;
        if (counter > trendingItem.length) {
            counter = 0;
        }
        // setTimeout(function() {
        playVideo(trendingItem[counter].id)
            .then(resp => resp.json())
            .then(resp => {
                console.log(trendingItem[counter]);
                console.log(resp);
                console.log(resp.results[0].key);
				let content = document.getElementById('video-section-content')
				content.innerHTML = `<section class="left">
					<div class="title">${trendingItem[counter].original_title}</div>
					<div class="title-description">${trendingItem[counter].overview}</div>
					<div class="d-flex mt-2">
						<button class="btn btn-light m-2"> <i class="bi bi-play-fill"
								style="color: black; padding: 0%;"></i> Play
							Now </button>
						<button class="btn btn-secondary m-2"><i class="bi bi-info-circle"
								style=" padding: 0%;"></i> More
							Info</button>
					</div>
				</section>`
                // updateBannerDetail(trendingItem[counter]);
                banner.innerHTML = `<iframe style="margin-left: -50%" width="200%" height="600" src="https://www.youtube.com/embed/${resp.results[0].key}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
            })
        // }, 15000)
        
        // banner.innerHTML = `<img src="${image_Path}${trendingItem[counter].backdrop_path}">`
    }, 15000)
}

function updateBannerDetail(iDetail) {
    let bannerDetail = document.getElementById('video-description');
    bannerDetail.innerHTML = `
        <h2 class="InTrendMovies">${iDetail.title}</h2>
        <p class="movie-today"></p>
        <p movie-info>${iDetail.overview}</p>
        <div class="action-buttons">
            <Button class="play"> Play</Button>
            <Button class="info-Btn"> More Info</Button>
        </div>`
}
// videos
function playVideo(id) {
    const options1 = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YjIxZTkxNmExNTFjNjMwMGRlOTg4NzZhYjlhY2RjMCIsInN1YiI6IjY0ODMzMjFkZTI3MjYwMDBlOGMwMDU1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iDvjgZGSuMIpSzf7M9DtglTxCdT_BopI1tkSKu8SJ9c'
        }
    };
    return fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options1)
};
//  hover addEventlistnes
function playOnHover() {
    let images_Box = document.querySelectorAll('.image-wrapper-class');
    console.log(images_Box);

    for (let i = 0; i < images_Box.length; i++) {
        images_Box[i].addEventListener("mouseenter", (event) => {
            playVideo(event.target.children[0].id)
                    .then(resp => resp.json())
                    .then(resp => {
                        console.log(resp.results[0].key);
                        event.target.children[0].innerHTML = `<iframe width="200" height="140" src="https://www.youtube.com/embed/${resp.results[0].key}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                    })
            
        })

        images_Box[i].addEventListener("mouseleave", (event) => {
            event.target.children[0].innerHTML = '';
        })
    }
}