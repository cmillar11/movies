var width = 960,
    height = 500;

var movieName = "Alice in Wonderland ";
var year = 2004;
var yearAdjusted = year - 2004;
var dataString = "data/trend_data.json";
var rankingMap = new Map();


var color = d3.scaleLinear()
  .domain([0, 50, 100])  
  .range(["white", "blue"]); 

function createRankingMap() {
    d3.json(dataString).then(function(trend_data) {
        
        var trends = trend_data[movieName][yearAdjusted][year];
    
        for (var j = 0; j < trends.length; j ++) {
            var geoCode = trends[j].geoCode;
            var rankValue = trends[j].value[0];
            rankingMap.set(geoCode, rankValue);
        }
    })
};


//TBD Work in process
function updateMap(event) {
    year = event.id;
    yearAdjusted = year - 2004;
    
    createRankingMap();
    
    
};
                   

createRankingMap();

var defaultFill = "#aaa";

var svg = d3.select("svg");

var projection = d3.geoAlbersUsa()
                   .scale(1070) // size, bigger is bigger
                   .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

d3.json("data/nielsentopo.json").then(function(dma){

    var nielsen = dma.objects.nielsen_dma.geometries;

    //Using tv.json to pull the Market Area names and DMA code for labeling
    d3.json("data/tv.json").then(function(tv){
        for (var i = 0; i < nielsen.length; i++){
            var dma_code = nielsen[i].id;
            var rankValue = rankingMap.get(String(dma_code));
            //console.log(rankValue);
            nielsen[i].properties["Designated Market Area (DMA)"] = tv[dma_code]["Designated Market Area (DMA)"];
            nielsen[i].properties["DMA Code"] = dma_code;
            nielsen[i].properties["Rank"] = rankValue;
            nielsen[i].properties["Color"] = color(rankValue);;
        }
    dma.objects.nielsen_dma.geometries = nielsen;

    //adds the regions     
    svg.append("g")
       .attr("class", "regions")
       .selectAll("path")
       .data(topojson.feature(dma, dma.objects.nielsen_dma).features)
       .enter().append("path")
       .attr("d", path)
       .attr("fill", function (d) { return d.properties.Color; })

        //Mouseover coloring effect
       .on("mouseover", function(d){
          d3.select(this)
          .attr("fill", "yellow")
          var string = "<p><strong>Market Area Name</strong>: " + d.properties.dma1 + "</p>";
          string += "<p><strong>DMA Code</strong>: " + d.properties.dma + "</p>";
          string += "<p><strong>Rank Value</strong>: " + d.properties.Rank + "</p>";
          d3.select("#textbox")
            .html("")
            .append("text")
            .html(string)
       })
      .on("mouseout", function(d){
         d3.select(this)
        .attr("fill", d.properties.Color)
      })
   //adds the edges     
   svg.append("path")
      .attr("class", "dma-borders")
      .attr("d", path(topojson.mesh(dma, dma.objects.nielsen_dma, function(a, b) { return true; })));
   })
});

///** SLIDER STUFF **?

var sliderRange = d3.range(0, 15).map(function (d) { return new Date(2004 + d, 10, 3); });

  var slider3 = d3.sliderHorizontal()
    .min(d3.min(sliderRange))
    .max(d3.max(sliderRange))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(400)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(sliderRange)
    .on('onchange', val => {
      d3.select("p#value3").text(d3.timeFormat('%Y')(val));
    });

console.log("between");

  var group3 = d3.select("div#slider3").append("svg")
    .attr("width", 500)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(30,30)");

  group3.call(slider3);

  d3.select("p#value3").text(d3.timeFormat('%Y')(slider3.value()));
  d3.select("a#setValue3").on("click", () => { slider3.value(new Date(2004, 11, 17)); d3.event.preventDefault(); });




//Sources
//https://bl.ocks.org/mbostock/4090848
//https://github.com/simzou/nielsen-dma/blob/master/index.html