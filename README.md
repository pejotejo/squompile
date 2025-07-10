# Squompile 

This extension creates a button to compile and run C++ code in Visual Studio Code using g++. It adds a button that runs a customizable g++ command to compile the current file and all files in the same directory, and then runs the resulting executable. 

## Features

In a C++ file, use the Squirell icon in the top right corner to compile and run the code. The extension will automatically detect the current file's directory and compile all C++ files in that directory using g++.

![](https://github.com/pejotejo/squompile/blob/main/button.png)


When running the code, the extension will create an executable file in the same directory as the source files. The name of the executable will be based on the name of the first source file compiled.

When the code is run, the output will be displayed in the terminal. If there are any compilation errors, they will also be shown in the terminal and as a message. 

## Extension Settings

You can customize the g++ command by modifying the used compile flags in your VS Code settings or using the settings.json (`"squompile.compileFlags": "-std=c++20 -Wall"`). 

The default flags are `-std=c++17 -Wall -Wextra -Wpedantic -g`. 
