<?php

ini_set('memory_limit', '4096m');
$json = json_decode(file_get_contents(__DIR__ . '/../town.json'));
$county_jsons = array();
foreach ($json->features as $feature) {
    if (!array_key_exists($feature->properties->name, $county_jsons)) {
        $county_jsons[$feature->properties->name] = new StdClass;
        $county_jsons[$feature->properties->name]->type = "FeatureCollection";
        $county_jsons[$feature->properties->name]->features = array();
    }
    $county_jsons[$feature->properties->name]->features[] = $feature;
}

foreach ($county_jsons as $name => $county_json) {
    file_put_contents(__DIR__ . '/../map-data/' . $name . '.json', json_encode($county_json));
}

$json = json_decode(file_get_contents(__DIR__ . '/../village.json'));
$county_jsons = array();
foreach ($json->features as $feature) {
    list($county, $town, $village) = explode('-', $feature->id);
    $name = $county . '-' . $town;

    if (!array_key_exists($name, $county_jsons)) {
        $county_jsons[$name] = new StdClass;
        $county_jsons[$name]->type = "FeatureCollection";
        $county_jsons[$name]->features = array();
    }
    $county_jsons[$name]->features[] = $feature;
}

foreach ($county_jsons as $name => $county_json) {
    file_put_contents(__DIR__ . '/../map-data/' . $name . '.json', json_encode($county_json));
}

