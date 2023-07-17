// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // status bar
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.text = "🐯Run ck3tiger🐯";
  statusBarItem.tooltip = "Run ck3tiger (tooltip)";
  statusBarItem.command = "ck3tiger-for-vscode.runCk3tiger";
  statusBarItem.show();

  const configuration = vscode.workspace.getConfiguration("ck3tiger");
  await vscode.window
    .showInputBox({ prompt: "Set path to your ck3tiger" })
    .then((ck3tiger_path) => {
      if (ck3tiger_path) {
        configuration.update(
          "ck3tiger.path",
          ck3tiger_path,
          vscode.ConfigurationTarget.Global
        );
      }
    });
  await vscode.window
    .showInputBox({ prompt: "Set path to your vanilla ck3" })
    .then((vanilla_path) => {
      if (vanilla_path) {
        configuration.update(
          "vanilla.path",
          vanilla_path,
          vscode.ConfigurationTarget.Global
        );
      }
    });

  let run_ck3tiger_command = vscode.commands.registerCommand(
    "ck3tiger-for-vscode.runCk3tiger",
    function () {
      vscode.window.showInformationMessage("🐅🐅🐅RAWR! ANGRY TIGER!🐯🐯🐯");
    }
  );

  let hello = vscode.commands.registerCommand(
    "ck3tiger-for-vscode.helloWorld",
    function () {
      vscode.window.showInformationMessage(
        "Hello World from ck3tiger for vscode!"
      );
    }
  );
  context.subscriptions.push(statusBarItem, hello, run_ck3tiger_command);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
