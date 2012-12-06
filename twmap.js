var width = 1200,
    height = 700;
var centered;

var projection = d3.geo.mercator().scale(50000).translate([-17000, 3350]);
var path = d3.geo.path().projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
;

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr('style', 'fill: none')
    .on("click", click_cb);

var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").append("g");

var ready = function(villages, data) {
console.log(arguments);
    if ('undefined' !== typeof(options.init_data)) {
        options.init_data(data);
    }

    var g_dom = g
        .attr("class", "villages")
        .selectAll("path")
        .data(villages.features, function(d){
            var ids = [];
            if (d.properties.county) {
                ids.push(d.properties.county);
            }
            if (d.properties.town) {
                ids.push(d.properties.town);
            }
            if (d.properties.village) {
                ids.push(d.properties.village);
            }
            return ids.join('-');
        })
        .enter().append("path")
        .attr("d", path)
        .on('click', click_cb);

    if ('undefined' !== typeof(options.mouseover_cb)) {
        g_dom.on('mouseover', options.mouseover_cb);
    }
    if ('undefined' !== typeof(options.style_cb)) {
        g_dom.attr('style', options.style_cb);
    }
}

var loaded = [];

var click_cb = function(d){
  var x = 0,
      y = 0,
      k = 1;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = -centroid[0];
    y = -centroid[1];
    k = 4;
    centered = d;
  } else {
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(1000)
      .attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")")
      .style("stroke-width", 1.5 / k + "px");
};

var options = {};
var twmap = function(geo_map1, geo_map2, data_csv, opt){
    options = opt;
    var job = queue()
        .defer(d3.json, geo_map1);
    if (data_csv) {
        job.defer(d3.csv, data_csv);
    }
    job.await(ready);
};
