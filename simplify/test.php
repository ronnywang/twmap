<?php

include('simplify.php');
ini_set('memory_limit', '4096m');

$json = json_decode(file_get_contents($_SERVER['argv'][1]));
foreach ($json->features as $feature_id => $feature) {
    $geometry = $feature->geometry;
    if ($geometry->type == 'MultiPolygon') {
        foreach ($geometry->coordinates as $coordinate_id => $polygons) {
            foreach ($polygons as $polygon_id => $points) {
                $tmp_points = array();
                foreach ($points as $point) {
                    $tmp_points[] = array('x' => $point[0], 'y' => $point[1]);
                }
                $simplify_points = @simplify($tmp_points, 0.1, true);
                $simplify_polygon = array();
                foreach ($simplify_points as $point) {
                    $simplify_polygon[] = array($point['x'], $point['y']);
                }
                $json->features[$feature_id]->geometry->coordinates[$coordinate_id][$polygon_id] = $simplify_polygon;
            }
        }
    } else {
        throw new Exception('test');
    }

}

echo json_encode($json); //, JSON_UNESCAPED_UNICODE);
