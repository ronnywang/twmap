var all_data = null;

var bluegreen_init_data = function(data){
    all_data = [];
    data.forEach(function(d){
        var id;
        if (d['村里']) {
            id = d['#縣市'] + '-' + d['鄉鎮'] + '-' + d['村里'];
        } else if (d['鄉鎮']) {
            id = d['#縣市'] + '-' + d['鄉鎮'];
        } else {
            id = d['#縣市'];
        }
        all_data[id] = d;
    });
};

var bluegreen_style_cb = function(d) {
    if ('undefined' == typeof(all_data[d.id])) {
        return '';
    }
    var rate = parseInt(all_data[d.id]['1得票']) / (parseInt(all_data[d.id]['1得票']) + parseInt(all_data[d.id]['2得票']));
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
