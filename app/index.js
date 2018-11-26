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

function readCSVFile (inputPath, cb) {
<<<<<<< HEAD
    
 fs.readFile(inputPath, 'utf8', function (err, fileData) {
=======
  fs.readFile(inputPath, 'utf8', function (err, fileData) {
>>>>>>> ee14896b51bca30a82b00ce98f27cb06c10132a3
    if (err) {
        throw err;
    }
    cb(null, fileData);
  })   
}

<<<<<<< HEAD
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
=======
async function main () {
    let dataObjectDone = false;
    let lastStartYear = false;
    // there's probably a better way to keep track of time but it works
    const years = ['2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']; 

    readCSVFile(moviesListPath, async function getMovieNames(err, result) {
        const movieNames = $.csv.toObjects(result);

        movieNames.forEach(movie => {
            movie.Name = movie.Name.slice(0, movie.Name.indexOf('('))
        })
        let dataObj = {};

        for (let i = 0; i < 1; i++) { // iterating through movies
            // setTimeout(function(){ console.log('wait!') }, 250);

            dataObj[movieNames[i].Name] = [];

            for (let y = 0; y < years.length - 1; y++) { // iterating through years

                await googleTrends.interestByRegion({keyword: movieNames[i].Name, startTime: new Date(years[y]), endTime: new Date(years[y+1]), geo: 'US', resolution: 'DMA'})
                    .then((results) => { 
                        const obj = JSON.parse(results)
                        let yearRow = {};
                        yearRow[years[y]] = obj.default.geoMapData;
                        dataObj[movieNames[i].Name].push(yearRow);
                        // console.log('modified data obj movie ', JSON.stringify(dataObj[movieNames[i].Name]));

                        // on last movie and range of years, so write object containing all accumulated results to file
                        dataObjectDone = (i == 0);
                        lastStartYear = (y == years.length - 2);

                        if (dataObjectDone && lastStartYear) {
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
>>>>>>> ee14896b51bca30a82b00ce98f27cb06c10132a3
        }
    })
}

main()
//console.log(getCSVFile([moviesListPath, genresInputPath]))

