var all_data = null;
var column_name = null;
//User Design

var processData = function(d)
{
    return parseFloat(d["1得票"]) / ( parseFloat(d['1得票']) + parseFloat(d['2得票']) );
}


var test_init_data = function(data){
    all_data = [];
    column_name = [];
    var countyIndex = -1;
    var cityIndex = -1;
    var villageIndex = -1;
    var dataIndex = -1;

    for( var i in global_data["table"]["cols"] )
    {
        if(global_data["table"]["cols"][i]=="#縣市")
            countyIndex = i;
        else if(global_data["table"]["cols"][i]=="鄉鎮")
            cityIndex = i;
        else if(global_data["table"]["cols"][i]=="村里")
            villageIndex = i;
        column_name[global_data["table"]["cols"][i]] = i;
    }
    for( var i in global_data["table"]["rows"] )
    {
        //Get naem of each row
        index = global_data["table"]["rows"][i][countyIndex];
        if(global_data["table"]["rows"][i][cityIndex]!="")
        {
            index += "-"+global_data["table"]["rows"][i][cityIndex];
            if(global_data["table"]["rows"][i][villageIndex]!="")
                index += "-"+global_data["table"]["rows"][i][villageIndex];
        }
        //Put data into each row
        all_data[index] = [];
        for( var j in global_data["table"]["cols"] )
        {
            all_data[index][global_data["table"]["cols"][j]] = global_data["table"]["rows"][i][j];
        }
    }
    //console.log(all_data);
};

var test_style_cb = function(d) {
    if ('undefined' == typeof(all_data[d.id])) {
        
        return '';
    }
    var rate = parseFloat(processData(all_data[d.id]));
    var rgb = [];
    var base = 255;
    console.log(rate);
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

var test_mouseover_cb = function(e){
    //console.log(e);
    var data = all_data[e.id];
    if ('undefined' == typeof(data)) {
        $('#info').text('不知道的鄉鎮: ' + e.id);
    }
    var body = '';
    for (var i in column_name) {
        if ('' !== data[column_name[i]]) {
            body += i + ': ' + data[i] + '<br>';
        }
    }
    $('#info').html(body);
};
