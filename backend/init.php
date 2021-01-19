<?php
session_start();


/**
 * DEBUGGING
 */
$debug = true;
if ($debug) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
}


if (!isset($relpath)) {
	$relpath = "";
}
require $relpath . 'backend/vendor/autoload.php';
require $relpath . 'backend/functions.php';

/**
 * DATABASE
 */
include_once($relpath . "up.php");
$conn = new PDO("mysql:host={$db["host"]};dbname={$db["database"]};charset=utf8", $db["user"], $db["password"]);

$link = str_replace("/", "", explode("?", $_SERVER['REQUEST_URI'])[0]);


/**
 *	LANGUAGE SETTINGS
 */
include_once("content/languages.php");
$languagecodes = array_map("getCode", $languages);

function getCode($c)
{
	return $c["code"];
}

$standard = false;
// LANGUAGE
if (isset($_COOKIE["lang"]) && !empty($_COOKIE["lang"])) {
	$cookie = $_COOKIE["lang"];

	if (!in_array($cookie, $languagecodes)) {
		$standard = true;
	}
} else {
	$standard = true;
}


if ($standard) {
	$browserlang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);

	$language = "en";
	if (in_array($browserlang, $languagecodes)) {
		$language = $browserlang;
	}

	setcookie("lang", $language, time() + 60 * 60 * 24 * 30, "/");
	echo "<script>window.location = ''</script>";
}

$content = getLanguageContent($_COOKIE["lang"], ($link == "") ? "index" : $link);
