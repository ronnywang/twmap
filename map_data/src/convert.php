<?php
	
ini_set("memory_limit","1024M");
$folder = '../../map-data/';


$i = 0;
$convert =  [];
if($handle = opendir($folder))
{
	while (false !== ($entry = readdir($handle)))
	{
		if ($entry != "." && $entry != "..") 
		{

			$filename = explode(".",$entry);
			$filename = $filename [0];
			echo $filename."\n";
			if(null != $convert[$filename])
			{
				//echo $filename."\n";
				continue;
			}else{
				$convert[$filename] = $i;
				copy("../../map-data/".$entry,"../".$convert[$filename].".json");
			}
			$i++;         
		}
	}
	closedir($handle);
}


$output = json_encode($convert,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
file_put_contents("./convert.json", $output);





?>