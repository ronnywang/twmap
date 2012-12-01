var width = 960,
    height = 500;
var centered;

var projection = d3.geo.mercator().scale(50000).translate([-16500, 3650]);
var path = d3.geo.path().projection(projection);

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.attr("class", "Blues");

var ready = function(error, villages, county, blue) {
    var rateById = {};

    blue.forEach(function(d) {
            var id;
            if (d['村里']) {
            id = d['#縣市'] + '-' + d['鄉鎮'] + '-' + d['村里'];
            } else if (d['鄉鎮']) {
            id = d['#縣市'] + '-' + d['鄉鎮'];
            } else {
            id = d['#縣市'];
            }
            rateById[id] = parseInt(d['1得票']) / (parseInt(d['1得票']) + parseInt(d['2得票']));
            });

    svg.append("g")
        .attr("class", "villages")
        .selectAll("path")
        .data(villages.features)
        .enter().append("path")
        .attr("style", function(d) {
                var rate = rateById[d.id];
                var rgb = [];
                var base = 255;
                if (rate > 0.5) { // 綠
                    color = Math.floor(2.0 * base * (1 - rate));
                    rgb = [color, base, color];
                } else if (rate < 0.5) { // 藍
                    color = Math.floor(2.0 * base * (rate));
                    rgb = [color, color, base];
                } else {
                    rgb = [base, base, base];
                }
                return 'fill:rgb(' + rgb.join(',') + ')';
                    })
                .attr("d", path)
                ;

                svg.append('path')
                .datum(county)
                .attr('class', 'county')
                .attr('d', path);
                }

var twmap = function(geo_map1, geo_map2, data_csv){
    queue()
        .defer(d3.json, geo_map1)
        .defer(d3.json, geo_map2)
        .defer(d3.csv, data_csv)
        .await(ready);
};
