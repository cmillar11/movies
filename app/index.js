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


// const result = calc.sum(numbersToAdd)
// console.log(`The result is: ${result}`)

// googleTrends.interestOverTime({keyword: 'Women\'s march'})
// .then(function(results){
//   console.log('These results are awesome', results);
// })
// .catch(function(err){
//   console.error('Oh no there was an error', err);
// });
// console.log(genres)
// const result = $.csv.toObjects(genres);
// console.log(result)

/* 

Goes through the rows of each csv file and puts them together.
     
*/
// function getCSVFile (pathArray) {
//     fs.readFile(pathArray[0], 'utf8', function (err, data) {
//         let rowArr = []

//         let dataArray = data.split(/\r?\n/);  //Be careful if you are in a \r\n world...
//         // Your array contains ['ID', 'D11', ... ]
//         for (let i = 0; i < dataArray.length; i++) {
//             rowArr[i] = dataArray[i]
//         }
//         return rowArr

//     })
//     // for (let j = 1; j < pathArray.length; j++) {
//     //     fs.readFile(pathArray[j], 'utf8', function(err, data) {
//     //         let currDataArray = data.split(/\r?\n/);

//     //         for (let x = 0; x < currDataArray.length; x++) {
//     //             //console.log(currDataArray[x].toString())
//     //             rowArr[x].concat(currDataArray[x].toString())
//     //         }
//     //     })

//     //     if (j === pathArray.length - 1) {
//     //         //console.log(rowArr)
//     //     }
//     // }

// }

function readCSVFile (inputPath, cb) {
  fs.readFile(inputPath, 'utf8', function (err, fileData) {
    if (err) {
        throw err;
    }
    cb(null, fileData);
  })   
}

async function main () {

    // there's probably a better way to keep track of time but it works
    const years = ['2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']; 

    readCSVFile(moviesListPath, async function getMovieNames(err, result) {
        const movieNames = $.csv.toObjects(result);

        movieNames.forEach(movie => {
            movie.Name = movie.Name.slice(0, movie.Name.indexOf('('))
        })
        let dataObj = {};

        for (let i = 0; i < 1; i++) { // iterating through movies
            dataObj[movieNames[i].Name] = [];

            for (let y = 0; y < years.length - 1; y++) { // iterating through years

                await googleTrends.interestByRegion({keyword: movieNames[i].Name, startTime: new Date(years[y]), endTime: new Date(years[y+1]), geo: 'US', resolution: 'REGION'})
                    .then((results) => { 
                        const obj = JSON.parse(results)
                        let yearRow = {};
                        yearRow[years[y]] = obj.default.geoMapData;
                        dataObj[movieNames[i].Name].push(yearRow);
                        // console.log('modified data obj movie ', JSON.stringify(dataObj[movieNames[i].Name]));

                        // on last movie and range of years, so write object containing all accumulated results to file
                        if (i == 0 && y == years.length - 2) {
                            console.log('data being written ', dataObj);
                            fs.appendFile(__dirname + '/data/my_file.json', JSON.stringify(dataObj), (err) => {
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
    })
}

main()
//console.log(getCSVFile([moviesListPath, genresInputPath]))

