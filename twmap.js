var TWmap = {};
TWmap.container = d3.select(document.getElementById("map"));
TWmap.map = d3.select(document.getElementById("map"));
TWmap.map_container = d3.select(document.getElementById("map_container"));
TWmap.idx = {};
TWmap.idx.convert = {};
TWmap.getNumberFromAttr = function(s)
{
  return parseInt(s.substr(0,s.length-2));
}
TWmap.width = TWmap.getNumberFromAttr(TWmap.map_container.style("width"));
//TWmap.width = 800;
TWmap.height = 600;
TWmap.color = d3.scale.linear().domain([0,0.5,1]).range(["#0000ff","#ffffff","#00ff00"]);
TWmap.get = function(s)
{
  if(s[0]=="#")
    return document.getElementById(s.substr(1));
};
TWmap.RESOLUTION_HIGH = 1;
TWmap.RESOLUTION_LOW = 2;
TWmap.resolution  = TWmap.RESOLUTION_HIGH;
TWmap.global_data = {};
TWmap.handleData = function(data)
{
  TWmap.global_data = data;
  var detail_map = null;
  switch(resolution)
  {
    case TWmap.RESOLUTION_HIGH:
      detail_map = 'town.json';
    break;
    case TWmap.RESOLUTION_LOW:
    default:
      detail_map = 'county.json';
  }


}
TWmap.processData = function(d)
{
    return parseFloat(d["1得票"]) / ( parseFloat(d['1得票']) + parseFloat(d['2得票']) );
}
TWmap.centered = null;

TWmap.projection = d3.geo.mercator().scale(50000).translate([-16750, 3350]);
TWmap.path = d3.geo.path().projection(TWmap.projection);

var svg = TWmap.map.append("svg")
    .attr("width", TWmap.width )
    .attr("height", TWmap.height)
;

svg.append("rect")
    .attr("width", TWmap.width)
    .attr("height", TWmap.height)
    .attr('style', 'fill: none')
    .on("click", click_cb);

var g = svg.append("g")
    .attr("transform", "translate(" + TWmap.width / 2 + "," + TWmap.height / 2 + ")").append("g");




var ready = function(error, villages, data,data2) {
    if ('undefined' !== typeof(options.init_data)) {
        options.init_data(data);
    }
    TWmap.idx.convert =  data2;
    var g_dom = g
        .attr("class", "villages")
        .selectAll("path")
        .data(villages.features, function(d){ return d.id; })
        .enter().append("path")
        .attr("d", TWmap.path)
        .on('click', click_cb);

    if ('undefined' !== typeof(options.mouseover_cb)) {
        g_dom.on('mouseover', options.mouseover_cb);
    }
    if ('undefined' !== typeof(options.mouseout_cb)) {
        g_dom.on('mouseout', options.mouseout_cb);
    }
    if ('undefined' !== typeof(options.style_cb)) {
        g_dom.attr('style', options.style_cb);
    }
}

var loaded = [];

var click_cb = function(d){
  if ('undefined' === typeof(loaded[d.id])) {
      loaded[d.id] = true;
      if (d.id.split('-').length > 2) { // 已經到村里等級了
          return;
      }
      queue()
          .defer(d3.json, 'map_data/' + TWmap.idx.convert[d.id] + '.json')
          .await(function(error, sub_polygon){
              if (!sub_polygon) {
                  return;
              }
              var g_dom = g
                  .selectAll('path')
                  .data(sub_polygon.features, function(d){ return d.id; })
                  .enter().append("path")
                  .attr("d", TWmap.path)
                  .on('click', click_cb)
              ;
              if ('undefined' !== typeof(options.mouseover_cb)) {
                  g_dom.on('mouseover', options.mouseover_cb);
              }
              if ('undefined' !== typeof(options.mouseout_cb)) {
                  g_dom.on('mouseout', options.mouseout_cb);
              }
              if ('undefined' !== typeof(options.style_cb)) {
                  g_dom.attr('style', options.style_cb);
              }
          });
    
  }
  var x = 0,
      y = 0,
      k = 1;

  if (d && TWmap.centered !== d) {
    var centroid = TWmap.path.centroid(d);
    x = -centroid[0];
    y = -centroid[1];
    if (d.id.split('-').length > 2) {
        k = 24;
    } else if (d.id.split('-').length > 1) {
        k = 8;
    } else {
        k = 4;
    }
    TWmap.centered = d;
  } else {
    TWmap.centered = null;
  }


  g.selectAll("path")
      .classed("active", TWmap.centered && function(d) { return d === TWmap.centered; });

  g.transition()
      .duration(1000)
      .attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")")
      .style("stroke-width", 1.5 / k + "px");
};

var options = {};
TWmap.twmap = function(geo_map1, geo_map2, data_csv, opt){
    options = opt;
    queue()
        .defer(d3.json, geo_map1)
        .defer(d3.csv, data_csv)
        .defer(d3.json,'./map_data/src/convert.json')
        .await(ready);
};
