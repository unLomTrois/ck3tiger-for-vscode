const vscode = require("vscode");
const { initStatusBarButton } = require("./src/statusbar");
const { checkConfiguration } = require("./src/configuration");
const {
  runCK3TigerCommand,
  resetPathsCommand,
  getProblemsFromLogCommand,
} = require("./src/commands");

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
    await context.globalState.update("last_version", current_version);
  }

  // checking configuration
  await checkConfiguration(logger);

  // status bar button
  initStatusBarButton(context);

  // status bar button logic
  const globalDiagnosticCollection =
    vscode.languages.createDiagnosticCollection("ck3tiger");

  const run_ck3tiger_command = runCK3TigerCommand(
    logger,
    globalDiagnosticCollection
  );

  const reset_paths_command = resetPathsCommand(logger);

  const get_problems_from_log_command = getProblemsFromLogCommand(
    logger,
    globalDiagnosticCollection
  );

  context.subscriptions.push(
    reset_paths_command,
    run_ck3tiger_command,
    get_problems_from_log_command
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
