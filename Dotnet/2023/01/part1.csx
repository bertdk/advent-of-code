using System;
using System.IO;

string[] lines = File.ReadAllLines("input.txt");

int result = 0;
foreach (var line in lines)
{
    int number1 = 0, number2 = 0;
    bool foundFirst = false;

    // Find the first numeric character
    foreach (char letter in line)
    {
        if (char.IsDigit(letter))
        {
            number1 = int.Parse(letter.ToString());
            foundFirst = true;
            break;
        }
    }

    // Find the last numeric character if first was found
    if (foundFirst)
    {
        foreach (char letter in line.Reverse())
        {
            if (char.IsDigit(letter))
            {
                number2 = int.Parse(letter.ToString());
                break;
            }
        }
    }

    result += (number1 * 10 + number2);
}

Console.WriteLine(result);
