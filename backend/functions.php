<?php


/////////////////////////////////////////////////////
//// DEBUG
/////////////////////////////////////////////////////


function debuglog($msg, $path = "backend/debug.log")
{

  try {
    $current = date("[d.m.Y - H:i:s]");

    $old = "";
    if (file_exists($path)) {
      $myfile = fopen($path, "r") or die("Unable to open file!");
      $old = fread($myfile, filesize($path));
    }

    $myfile = fopen($path, "w") or die("Unable to open file!");
    fwrite($myfile, $old);
    $new = $msg . "\n";
    fwrite($myfile, "$current $new");
    fclose($myfile);
  } catch (\Exception $e) {
  }
}



/////////////////////////////////////////////////////
//// HELPYHELP
/////////////////////////////////////////////////////

function mapValToKeys($array, $keyvalue, $value)
{
  $newarray = array();

  foreach ($array as $a) {
    $newarray[$a[$keyvalue]] = $a[$value];
  }

  return $newarray;
}

function getUserIpAddr()
{
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
  } else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
  } else {
    $ip = $_SERVER['REMOTE_ADDR'];
  }
  return $ip;
}


/////////////////////////////////////////////////////
//// LANGUAGE SETTINGS
/////////////////////////////////////////////////////
function getLanguageContent($lang, $page)
{
  include_once("content/$lang/$page.php");
  return $content;
}
