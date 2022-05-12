//requires
const http = require('http');
const pug = require("pug");
const sqlite3 = require('sqlite3').verbose();

const renderHome = pug.compileFile('home.pug');

let result = {};
let genre = [];
let producer = [];
let actor = [];
let director = [];
let suggestion = [];


const server = http.createServer((req, res)=>{
    //Handle GET req
    if(req.method === "GET"){
        if(req.url ==="/" || req.url ==="/home"){
            res.setHeader("Content-Type", "text/html");
            sendResponse(res, 200, renderHome());
        }
        else if(req.url ==="/movie"){
            res.setHeader("Content-Type", "application/json");
            console.log(result);
            sendResponse(res, 200, JSON.stringify(result));
        }
        else if(req.url ==="/rate"){
            res.setHeader("Content-Type", "application/json");
            console.log(suggestion);
            sendResponse(res, 200, JSON.stringify(suggestion));
        }
        else if(req.url ==="/genre"){
            res.setHeader("Content-Type", "application/json");
            console.log(suggestion);
            sendResponse(res, 200, JSON.stringify(suggestion));
        }
        else if(req.url ==="/actor"){
            res.setHeader("Content-Type", "application/json");
            console.log(suggestion);
            sendResponse(res, 200, JSON.stringify(suggestion));
        }
    }
    else if(req.method === "POST"){
        if(req.url ==="/movie"){
            let data = "";
			req.on('data', (chunk) => {
				data += chunk;
			});
			req.on('end', () => {
				let ress = JSON.parse(data);
                console.log(ress);

                let db = new sqlite3.Database('./movie.db', sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                      return console.error(err.message);
                    }
                    console.log('Connected to the in-memory SQlite database.');
                });
               
                db.serialize(() => {
                    db.each(`SELECT *
                            FROM Movie
                            WHERE Title="${ress}"`, (err, row) => {
                            if (err) {
                                console.error(err.message);
                            }else{
                                result = {};
                                result.Title = row.Title;
                                result.Premiered = row.Premiered;
                                result.Average_rate = row.Average_rate;
                            }
                    });
                    db.all(`select Genre_name from Genre natural join (
                            select Genre_id from GenreOf natural join
                            Movie
                            where Title="${ress}")`, (err, rows) => {
                            if (err) {
                                console.error(err.message);
                            }else{
                                genre = [];
                                rows.forEach( row => genre.push(row.Genre_name))
                                result.Genre = genre;
                            }
                    });
                    db.all(`select Name,role from Person join (
                        select P_id,role from ActedBy join
                        Movie on ActedBy.M_id = Movie_id
                        where Title="${ress}") 
                        where Person_id = P_id`, (err, rows) => {
                        if (err) {
                            console.error(err.message);
                        }else{
                            actor = [];
                            i = 0;
                            rows.forEach( row => actor.push(row.Name))
                            rows.forEach( row => actor[i++] += row.role)
                            result.Actor = actor;
                        }
                    });
                    db.all(`select Name from Person join (
                        select P_id from DirectedBy join
                        Movie on DirectedBy.M_id = Movie_id
                        where Title="${ress}")
                        where Person_id = P_id`, (err, rows) => {
                        if (err) {
                            console.error(err.message);
                        }else{
                            director = [];
                            rows.forEach( row => director.push(row.Name))
                            result.Director = director;
                        }
                    });
                    db.all(`select Name from Person join (
                        select P_id from ProducedBy join
                        Movie on ProducedBy.M_id = Movie_id
                        where Title="${ress}")
                        where Person_id = P_id`, (err, rows) => {
                        if (err) {
                            console.error(err.message);
                        }else{
                            producer = [];
                            rows.forEach( row => producer.push(row.Name))
                            result.Producer = producer;
                        }
                    });
                    db.all(`select Title from Movie
                    natural join(
                    select Movie_id from GenreOf
                    natural join(
                    select Genre_id from GenreOf
                    natural join 
                    (select * from Movie
                    where Title="${ress}")))
                    limit 20`, (err, rows) => {
                        if (err) {
                            console.error(err.message);
                        }else{
                            suggestion = [];
                            rows.forEach( row => suggestion.push(row.Title))
                            result.Suggestion = suggestion;
                        }
                    });

                });
                  
                // close the database connection
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Close the database connection.');
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.write("Success .");
                    res.end();
                });    
                   
			});
        }
        else if(req.url ==="/rate"){
            let data = "";
			req.on('data', (chunk) => {
				data += chunk;
			});
			req.on('end', () => {
                let ress = JSON.parse(data);
                console.log(ress);

                let db = new sqlite3.Database('./movie.db', sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                      return console.error(err.message);
                    }
                    console.log('Connected to the in-memory SQlite database.');
                });

                db.serialize(() => {
                    db.all(`select Title from Movie
                    where Average_rate="${ress}"
                    limit 20`, (err, rows) => {
                        if (err) {
                            console.error(err.message);
                        }else{
                            suggestion = [];
                            rows.forEach( row => suggestion.push(row.Title))
                        }
                    });
                });

                // close the database connection
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Close the database connection.');
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.write("Success .");
                    res.end();
                }); 
            });
        }  
        else if(req.url ==="/genre"){
            let data = "";
			req.on('data', (chunk) => {
				data += chunk;
			});
			req.on('end', () => {
                let ress = JSON.parse(data);
                console.log(ress);

                let db = new sqlite3.Database('./movie.db', sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                      return console.error(err.message);
                    }
                    console.log('Connected to the in-memory SQlite database.');
                });

                db.serialize(() => {
                    db.all(`select Title from Movie
                    natural join(
                    select Movie_id from GenreOf
                    natural join(
                    select Genre_id from Genre
                    where Genre_name="${ress}"))
                    limit 20`, (err, rows) => {
                        if (err) {
                            console.error(err.message);
                        }else{
                            suggestion = [];
                            rows.forEach( row => suggestion.push(row.Title))
                        }
                    });
                });

                // close the database connection
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Close the database connection.');
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.write("Success .");
                    res.end();
                }); 
            });
        }
        else if(req.url ==="/actor"){
            let data = "";
			req.on('data', (chunk) => {
				data += chunk;
			});
			req.on('end', () => {
                let ress = JSON.parse(data);
                console.log(ress);

                let db = new sqlite3.Database('./movie.db', sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                      return console.error(err.message);
                    }
                    console.log('Connected to the in-memory SQlite database.');
                });

                db.serialize(() => {
                    db.all(`select Title from Movie
                    join(
                    select M_id from ActedBy
                    join(
                    select Person_id from Person
                    where name="${ress}")
                    on Person_id=P_id)
                    on M_id=Movie_id`, (err, rows) => {
                        if (err) {
                            console.error(err.message);
                        }else{
                            suggestion = [];
                            rows.forEach( row => suggestion.push(row.Title))
                        }
                    });
                });

                // close the database connection
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Close the database connection.');
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.write("Success .");
                    res.end();
                }); 
            });
        }
    } 
    else sendResponse(res, 400, "Bad request");
});



function sendResponse(response, statusCode, data){
    response.statusCode = statusCode;
    response.write(data);
    response.end();
}




server.listen(3000);
console.log("Server listening at http://localhost:3000");