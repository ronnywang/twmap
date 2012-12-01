var width = 960,
    height = 500;
var centered;

var projection = d3.geo.mercator().scale(50000).translate([-16500, 3650]);
var path = d3.geo.path().projection(projection);

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.attr("class", "Blues");

var ready = function(error, villages, county, data) {
    options.init_data(data);

    svg.append("g")
        .attr("class", "villages")
        .selectAll("path")
        .data(villages.features)
        .enter().append("path")
        .attr("style", options.style_cb)
        .attr("d", path)
    ;

    svg.append('path')
        .datum(county)
        .attr('class', 'county')
        .attr('d', path);
}

var options = {};
var twmap = function(geo_map1, geo_map2, data_csv, opt){
    options = opt;
    queue()
        .defer(d3.json, geo_map1)
        .defer(d3.json, geo_map2)
        .defer(d3.csv, data_csv)
        .await(ready);
};
