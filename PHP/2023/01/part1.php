<?php

$file = fopen("input.txt", "r");

$result = 0;
while (($line = fgets($file)) !== false) {
    $number1 = $number2 = 0;
    $length = strlen($line);
    
    // Find the first numeric character
    for ($i = 0; $i < $length; $i++) {
        if (ctype_digit($line[$i])) {
            $number1 = intval($line[$i]);
            break;
        }
    }
    
    // Find the last numeric character
    for ($i = $length - 1; $i >= 0; $i--) {
        if (ctype_digit($line[$i])) {
            $number2 = intval($line[$i]);
            break;
        }
    }
    
    $result += ($number1 * 10 + $number2);
}
fclose($file);

echo $result;
