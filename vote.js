var all_data = null;
var column_name = null;
//User Design

TWmap.processData = function(d)
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
    var rate = parseFloat(TWmap.processData(all_data[d.id]));
    return 'fill:' + TWmap.color(rate);
};

var test_mouseover_cb = function(e){
    //console.log(e);
    var data = all_data[e.id];
    if ('undefined' == typeof(data)) {
        $('#info').text('不知道的鄉鎮: ' + e.id);
        return;
    }
    var body = '';
    for (var i in column_name) {
        if ('' !== data[column_name[i]]) {
            body += i + ': ' + data[i] + '<br>';
        }
    }
    d3.select(TWmap.get("#info")).html(body);
    //var position = d3.mouse(document.getElementsByTagName("body")[0]);
    //console.log(position);
    //d3.select(TWmap.get("#info")).style("display","").style("left",(position[0]+50)+"px").style("top",position[1]+"px");

};
var test_mouseout_cb = function(e)
{
    //d3.select(TWmap.get("#info")).style("display","none");
    d3.select(TWmap.get("#info")).html("");
};
