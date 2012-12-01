var rate_data = null;

var bluegreen_init_data = function(data){
    rate_data = [];
    data.forEach(function(d){
        var id;
        if (d['村里']) {
            id = d['#縣市'] + '-' + d['鄉鎮'] + '-' + d['村里'];
        } else if (d['鄉鎮']) {
            id = d['#縣市'] + '-' + d['鄉鎮'];
        } else {
            id = d['#縣市'];
        }
        rate_data[id] = parseInt(d['1得票']) / (parseInt(d['1得票']) + parseInt(d['2得票']));
    });
};

var bluegreen_style_cb = function(d) {
    var rate = rate_data[d.id];
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
};
