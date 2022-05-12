let result = {};
let list = [];

function suggestionName(){
	let req = new XMLHttpRequest();

	req.open("POST", "/movie", true);
    req.setRequestHeader("Content-Type", "application/json");

    let search = document.getElementById("search-input").value;
	
    let data = JSON.stringify(search);
    req.send(data);

    req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			getMovie();		
		}
	}
}
function suggestionRate(){
	let req = new XMLHttpRequest();

	req.open("POST", "/rate", true);
    req.setRequestHeader("Content-Type", "application/json");

    let search = document.getElementById("search-input").value;
	
    let data = JSON.stringify(search);
    req.send(data);

    req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			getMovieRate();		
		}
	}
}
function suggestionGenre(){
	let req = new XMLHttpRequest();

	req.open("POST", "/genre", true);
    req.setRequestHeader("Content-Type", "application/json");

    let search = document.getElementById("search-input").value;
	
    let data = JSON.stringify(search);
    req.send(data);

    req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			getMovieGenre();		
		}
	}
}
function suggestionActor(){
	let req = new XMLHttpRequest();

	req.open("POST", "/actor", true);
    req.setRequestHeader("Content-Type", "application/json");

    let search = document.getElementById("search-input").value;
	
    let data = JSON.stringify(search);
    req.send(data);

    req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			getMovieActor();		
		}
	}
}

function getMovie(){
	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			let data = JSON.parse(req.response);
			result = {};
			result = data;
			document.getElementById("movieInfo").innerHTML = movieInfoRender();
			document.getElementById("suggestionList").innerHTML = movieInfoRenderSuggestion();
		}
	}
	req.open("GET", "/movie", true);
    req.send();
}

function getMovieRate(){
	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			let data = JSON.parse(req.response);
			result = {};
			result = data;
			document.getElementById("movieInfo").innerHTML = '';
			document.getElementById("suggestionList").innerHTML = movieInfoRenderSuggestionRate();
		}
	}
	req.open("GET", "/rate", true);
    req.send();
}

function getMovieGenre(){
	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			let data = JSON.parse(req.response);
			result = {};
			result = data;
			document.getElementById("movieInfo").innerHTML = '';
			document.getElementById("suggestionList").innerHTML = movieInfoRenderSuggestionRate();
		}
	}
	req.open("GET", "/genre", true);
    req.send();
}
function getMovieActor(){
	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			let data = JSON.parse(req.response);
			result = {};
			result = data;
			document.getElementById("movieInfo").innerHTML = '';
			document.getElementById("suggestionList").innerHTML = movieInfoRenderSuggestionRate();
		}
	}
	req.open("GET", "/actor", true);
    req.send();
}

function movieInfoRender(){
	let data = '';
	Object.keys(result).forEach(elem => {
		if(elem === "Title"){
			data += `<h3>${result[elem]}</h3>`
			data += `<p>Original Title: ${result[elem]}</p>`
		}
		else if(elem === "Premiered"){
			data += `<p>Premiered: ${result[elem]}</p>`
		}
		else if(elem === "Average_rate"){
			data += `<p>Rate: ${result[elem]}</p>`
		}
		else if(elem === "Genre"){	
			data += `<p>Genre: ${result[elem]}</p>`
		}
		else if(elem === "Producer"){	
			data += `<p>Producer: ${result[elem]}</p>`
		}
		else if(elem === "Actor"){	
			data += `<p>Actor/Actress[role]: ${result[elem]}</p>`
		}
		else if(elem === "Director"){	
			data += `<p>Director: ${result[elem]}</p>`
		}
		else if(elem === "Suggestion"){	
			list = result[elem];
		}
	});	
	return data;
}

function movieInfoRenderSuggestion(){
	let sugg = `<h3>Suggested Movies: </h3>`;
	for(let i=0;i<list.length;i++){
		sugg += `<p>${list[i]}</p>`
	}
	return sugg;
}

function movieInfoRenderSuggestionRate(){
	let sugg = `<h3>Suggested Movies: </h3>`;
	for(let i=0;i<result.length;i++){
		sugg += `<p>${result[i]}</p>`
	}
	return sugg;
}