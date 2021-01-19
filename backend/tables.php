<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once("../db.php");
$conn = new PDO("mysql:host={$db["host"]};dbname={$db["database"]};charset=utf8", $db["user"], $db["password"]);

// VARS
$tablename = "name";
$stm = $conn->prepare("SELECT table_name FROM information_schema.tables WHERE table_name = '$tablename' AND table_schema = '{$db["database"]}';");
$stm->execute();
if ($stm->rowCount() == 0) {
  $sql = "CREATE TABLE $tablename (
              id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY
            );";
  $stmt = $conn->prepare($sql);
  $stmt->execute();

  if ($stmt->errorInfo()[0] == "00000") {
    echo "Table $tablename was created.<br>";
  } else {
    print_r($stmt->errorInfo());
  }

  /*
  $sql = "INSERT INTO $tablename (keyid,value) VALUES ('name','value');";
  $stmt = $conn->prepare($sql);
  $stmt->execute();

  if ($stmt->errorInfo()[0] == "00000") {
    echo "Values were inserted into $tablename<br>";
  } else {
    print_r($stmt->errorInfo());
  }*/
} else {
  echo "Table $tablename already exists.<br>";
}
