const vscode = require("vscode");
const { initStatusBarButton } = require("./src/statusbar");
const { generateProblems } = require("./src/generateProblems");
const {
  checkConfiguration,
  checkPaths,
  resetPaths,
} = require("./src/configuration");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const logger = vscode.window.createOutputChannel("ck3tiger");
  logger.appendLine("Initializing ck3tiger extension");

  logger.appendLine("Checking version");
  const current_version = context.extension.packageJSON.version;
  const last_version = await context.globalState.get("last_version");
  if (last_version === undefined) {
    logger.appendLine("No previous version found");
  }
  if (last_version !== current_version) {
    logger.appendLine("Updating cached version");
    context.globalState.update("last_version", current_version);
  }

  // checking configuration
  const configuration = await checkConfiguration(logger);

  // status bar button
  initStatusBarButton(context);

  // status bar button logic
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("ck3tiger");
  let runCk3tigerCommand = vscode.commands.registerCommand(
    "ck3tiger-for-vscode.runCk3tiger",
    async () => {
      const { ck3_path, ck3tiger_path } = await checkPaths(logger);

      vscode.window.showInformationMessage(`your ck3 path is ${ck3_path}`);
      vscode.window.showInformationMessage(
        `your ck3tiger path is ${ck3tiger_path}`
      );
      vscode.window.showInformationMessage("🐅🐅🐅RAWR! ANGRY TIGER!🐯🐯🐯");

      // generateProblems(diagnosticCollection);
    }
  );

  let helloWorldCommand = vscode.commands.registerCommand(
    "ck3tiger-for-vscode.helloWorld",
    () => {
      vscode.window.showInformationMessage(
        "Hello World from ck3tiger for vscode!"
      );
    }
  );

  let resetPathsCommand = vscode.commands.registerCommand(
    "ck3tiger-for-vscode.resetPaths",
    async () => {
      await resetPaths(logger);
      await checkPaths(logger);
    }
  );

  context.subscriptions.push(
    helloWorldCommand,
    runCk3tigerCommand,
    resetPathsCommand
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
