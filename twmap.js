var width = 960,
    height = 500;
var centered;

var projection = d3.geo.mercator().scale(50000).translate([-16500, 3650]);
var path = d3.geo.path().projection(projection);
var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
    .scaleExtent([height, 10000 * height])
    .on("zoom", zoom);

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.attr("class", "Blues");

var taiwan = svg.append("g")
    .attr("id", "taiwan")
    .call(zoom);

taiwan.append("rect")
    .attr("class","white")
    .attr("width", width)
    .attr("height", height);



var ready = function(error, villages, county, data) {
    if ('undefined' !== typeof(options.init_data)) {
        options.init_data(data);
    }

    var g_dom = taiwan.append("g")
        .attr("class", "villages")
        .selectAll("path")
        .data(villages.features)
        .enter().append("path")
        .attr("d", path)
        
    ;
    if ('undefined' !== typeof(options.mouseover_cb)) {
        g_dom.on('mouseover', options.mouseover_cb);
    }
    if ('undefined' !== typeof(options.style_cb)) {
        g_dom.attr('style', options.style_cb);
    }

    taiwan.append('path')
        .datum(county)
        .attr('class', 'county')
        .attr('d', path)
        ;
}


function zoom() {
        projection.translate(d3.event.translate).scale(d3.event.scale);
        taiwan.selectAll("path").attr("d", path);
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
