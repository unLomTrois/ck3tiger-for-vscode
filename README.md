# ck3-tiger for VS Code


Are you tired of constantly dealing with the tedious process of *open error.log* -> *copy path to an error* -> *navigate to the path* -> *fix the error* -> *go back to the error log* -> *repeat*?

This extension integrates the [ck3tiger](https://github.com/amtep/ck3-tiger) functionality to Visual Studio Code, enabling you to view errors directly in the Problems tab. 

## Problem tab

![image](https://github.com/unLomTrois/ck3tiger-for-vscode/assets/51882489/06983d62-0120-4f7d-ac4b-c69a85faa6bf)

![image](https://github.com/unLomTrois/ck3tiger-for-vscode/assets/51882489/23ed95c8-2769-4565-85b6-af133ee9e5e9)

## Errors in the editor

![image](https://github.com/unLomTrois/ck3tiger-for-vscode/assets/51882489/34c798a7-db9b-4f75-b3bd-70ca5db5b561)

# Usage

After activation, the extension will ask you few questions:
1. path to your ck3tiger binary
![image](https://github.com/unLomTrois/ck3tiger-for-vscode/assets/51882489/59e4c154-3b01-4429-847a-898e6b31b15d)
2. path to ck3 "game" folder
![image](https://github.com/unLomTrois/ck3tiger-for-vscode/assets/51882489/050e4fc2-e926-435b-b296-3cec278b251f)
3. path to the descriptor.mod file
![image](https://github.com/unLomTrois/ck3tiger-for-vscode/assets/51882489/310a9c18-28a4-4a7a-949c-aff251462f6c)

Then you can run ck3tiger from the status bar:
![image](https://github.com/unLomTrois/ck3tiger-for-vscode/assets/51882489/2005423e-27bd-4835-9aaf-4a929ca45eb8)

## How to get rid of a problem I just fixed?

Because the ck3tiger is not a language server, to get rid of the problem, you'll need to run ck3tiger again

## Get problems without running ck3tiger

If you have not much RAM, you can run ck3tiger in its folder, and write the output to "tiger.json" file, and then run vscode and run command "Get problems from the log file"

![image](https://github.com/unLomTrois/ck3tiger-for-vscode/assets/51882489/94642c2d-dd06-4796-b824-569aa109db79)

# Disclamer

Please be aware that this extension is still in development and may have some rough edges.

Currently, it has been tested only on Windows, and its compatibility with Linux systems is not guaranteed.

Feel free to try it out and provide feedback to help us improve the extension further!
