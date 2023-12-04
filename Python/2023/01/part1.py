file = open("input.txt", "r")
lines = file.readlines()

result = 0
for line in lines:
    number1, number2 = 0, 0
    for letter in line:
        if(letter.isnumeric()):
            number1 = int(letter)
            break
    
    for letter in line[len(line)::-1]:
        if(letter.isnumeric()):
            number2 = int(letter)
            break
    result += (number1 * 10 + number2)

print(result)