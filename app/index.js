// app/index.js
//const calc = require('./calc')
const fs = require('fs')
const path = require('path')
var parse = require('csv-parse')
var os = require("os")

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

function main () {
    
    readCSVFile(moviesListPath, function getMovieNames(err, result) {
        const movieNames = $.csv.toObjects(result);
        for (let i = 0; i < 10; i++) {
            googleTrends.interestOverTime({keyword: movieNames[i].Name})
                .then(function(results){
                    console.log(results)
                    const data = '{'.concat('\'',movieNames[i].Name, '\'', ':', results, '},\n');
                    //console.log(data) 
                    fs.appendFile(__dirname + '/data/my_file.json', data, (err) => {
                        if (err) throw err;
                        console.log('appended!')
                    })               
                })
                .catch(function(err){
                    //console.error('Oh no there was an error', err);
                });      
        }
    })
}

main()
//console.log(getCSVFile([moviesListPath, genresInputPath]))

