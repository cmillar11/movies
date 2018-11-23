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

function main () {

    // there's probably a better way to keep track of years?
    const years = ['2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']; 

    readCSVFile(moviesListPath, function getMovieNames(err, result) {
        const movieNames = $.csv.toObjects(result);

        let dataObj = {};
        
        // iterating through movies
        for (let i = 0; i < 1; i++) {
            // googleTrends.interestOverTime({keyword: movieNames[i].Name})
            //     .then(function(results){
            //         const data = '{'.concat('\'',movieNames[i].Name, '\'', ':', results, '},\n');
            //         console.log(typeof data) 
            //         fs.appendFile(__dirname + '/data/my_file.json', data, (err) => {
            //             if (err) throw err;
            //             console.log('appended!')
            //         })               
            //     })
            //     .catch(function(err){
            //         //console.error('Oh no there was an error', err);
            //     });   
                
            // iterating through year ranges
            dataObj[movieNames[i].Name] = [];
            for (let y = 0; y < years.length - 1; y++) {

                // assign the promise itself to the global varialbe
                let yearRow = googleTrends.interestByRegion({keyword: movieNames[i].Name, startTime: new Date(years[y]), endTime: new Date(years[y + 1]), geo: 'US', resolution: 'DMA'})
                    .then((results) => { 
                        // console.log('data obj at beginning of then', dataObj)
                        //console.log(results)
                        const obj = JSON.parse(results)
                        // console.log(obj)
                        // console.log(obj.default.geoMapData)
                        let yearRow = {};
                        yearRow[years[y]] = obj.default.geoMapData;
                        // let movieRow = {movieNames[i].Name: };

                        dataObj[movieNames[i].Name].push(yearRow);

                        //console.log(dataObj[movieNames[i].Name]);
                        //console.log(yearRow) 
                        // console.log(JSON.stringify(dataObj)) 
                        // console.log(dataObj)
                        // const data = '{'.concat('\'', 'Donald Trump', '\'', ':', results, '},\n');
                        //const data = '{'.concat('\'', movieNames[i].Name, '\'', ':', dataObj, '},\n');
                        // console.log('dataObj is ', JSON.stringify(dataObj[movieNames[i].Name]));
                        if (y == years.length - 2) {
                            // on last year range, so write object to file
                            fs.appendFile(__dirname + '/data/my_file.json', JSON.stringify(dataObj), (err) => {
                                if (err) throw err;
                                console.log('appended!')
                        })  

                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })

                    // setTimeout(()=>{
                    //     console.log('year row is ', yearRow);
                    //     dataObj[movieNames[i].Name].push(yearRow);
                    //     console.log(JSON.stringify(dataObj)) 
                    // });
    
                    // console.log('after single promise')

                    // let thenProm = resolvedProm.then((value)=>{
                    //     console.log("this gets called after the end of the main stack. the value received and returned is: " + value);
                    //     return value;
                    // });
            }

            // console.log(dataObj)
            // console.log(JSON.stringify(dataObj)) 

            // append to file after all movies over all time ranges have been added into a JSON object, dataObj
            // console.log('final data obj')
            // fs.appendFile(__dirname + '/data/my_file.json', JSON.stringify(dataObj), (err) => {
            //     if (err) throw err;
            //     console.log('appended!')
            // })  
        }
    })
}

main()
//console.log(getCSVFile([moviesListPath, genresInputPath]))

