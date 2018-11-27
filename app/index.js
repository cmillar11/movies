// app/index.js
//const calc = require('./calc')
const fs = require('fs')
const path = require('path')
var parse = require('csv-parse')

const googleTrends = require('google-trends-api')
const $ = jQuery = require('jquery')
$.csv = require('jquery-csv')

const genresInputPath = __dirname +'/data/genre.csv'
const moviesListPath = __dirname +'/data/movies_list.csv'
const ratingsPath = __dirname +'/data/MPAA_ratings.csv'

function readCSVFile (inputPath, cb) {
  fs.readFile(inputPath, 'utf8', function (err, fileData) {
    if (err) {
        throw err;
    }
    cb(null, fileData);
  })   
}

async function main () {
    let dataObjectDone = false;

    const genres = [
{genre: 'Action', movies: ['Captain America: Civil War', 
'Batman v Superman: Dawn of Justice', 
'Suicide Squad'
]}, {genre: 'SciFi', movies: ['Star Trek Beyond',
	'Rogue One: A Star Wars Story',
	'Independence Day: Resurgence'
]}, {genre: 'Comedy', movies: ['Finding Dory', 'Deadpool',
	'Zootopia'
]}, {genre: 'Drama', movies: ['Hidden Figures',
	'La La Land',
	'Me Before You'
]}, {genre: 'Animated', movies: ['Finding Dory',
	'Secret Life of Pets',
	'Zootopia'
]}, {genre: 'Fantasy', movies: ['The Jungle Book',
	'Fantastic Beasts and Where to Find Them',
	'Ghostbusters'
]}, {genre: 'Horror', movies: ['The Conjuring 2',
	'The Purge: Election Year',
	'Don’t Breathe'
]}];


    readCSVFile(moviesListPath, async function getMovieNames(err, result) {
        // const movieNames = $.csv.toObjects(result);

        // movieNames.forEach(movie => {
        //     movie.Name = movie.Name.slice(0, movie.Name.indexOf('('))
        // })
        let dataObj = {};

        for (let i = 0; i < genres.length; i++) { // iterating through genres

            let genre = genres[i].genre
            dataObj[genre] = [];

            for (let j = 0; j < 3; j++) {
                let movie = genres[i].movies[j]

                await googleTrends.interestByRegion({keyword: movie, startTime: new Date(2016), endTime: new Date(2017), geo: 'US', resolution: 'DMA'})
                    .then((results) => { 
                        dataObj[genre][movie] = [];
                        const obj = JSON.parse(results)

                        let yearRow = {};
                        yearRow[2016] = obj.default.geoMapData;
                        dataObj[genre][movie].push(yearRow);
                        // console.log('modified data obj movie ', JSON.stringify(dataObj[movieNames[i].Name]));

                        // on last movie of last genre, so write object containing all accumulated results to file
                        dataObjectDone = (i == genres.length - 1 && j == 2);

                        if (dataObjectDone) {
                            console.log('data being written ', dataObj);
                            fs.appendFile(__dirname + '/data/2016MoviesByGenre.json', JSON.stringify(dataObj), (err) => {
                                if (err) throw err;
                                console.log('appended!')
                            })  
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } 
               
        }
        // console.log(JSON.stringify(dataObj))
    })
}

// main()

//     readCSVFile(moviesListPath, async function getMovieNames(err, result) {
//         const movieNames = $.csv.toObjects(result);

//         movieNames.forEach(movie => {
//             movie.Name = movie.Name.slice(0, movie.Name.indexOf('('))
//         })
//         let dataObj = {};
//         let numQueries = 0;
//         for (let i = 0; i < movieNames.length; i++) { // iterating through movies
//             // setTimeout(function(){ console.log('wait!') }, 250);

//             dataObj[movieNames[i].Name] = [];

//             for (let y = 0; y < years.length - 1; y++) { // iterating through years
//                 console.log(numQueries)
//                 setTimeout(function(){ console.log('wait!') }, 1000);
//                 numQueries++;

//                 // await with a time, await for it to actually finish
//                 await googleTrends.interestByRegion({keyword: movieNames[i].Name, startTime: new Date(years[y]), endTime: new Date(years[y+1]), geo: 'US', resolution: 'DMA'})
//                     .then((results) => { 
//                         const obj = JSON.parse(results)
//                         let yearRow = {};
//                         yearRow[years[y]] = obj.default.geoMapData;
//                         dataObj[movieNames[i].Name].push(yearRow);
//                         // console.log('modified data obj movie ', JSON.stringify(dataObj[movieNames[i].Name]));

//                         // on last movie and range of years, so write object containing all accumulated results to file
//                         dataObjectDone = (i == movieNames.length - 2);
//                         lastStartYear = (y == years.length - 2);

//                         if (dataObjectDone && lastStartYear) {
//                             console.log('data being written ', dataObj);
//                             // fs.appendFile(__dirname + '/data/my_file.json', JSON.stringify(dataObj), (err) => {
//                             //     if (err) throw err;
//                             //     console.log('appended!')
//                             // })  
//                         }
//                     })
//                     .catch((err) => {
//                         console.log(err);
//                     })
//                 }
//         }
//     })
// }

main()