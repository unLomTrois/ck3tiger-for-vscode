const vscode = require("vscode");
const { initStatusBarButton } = require("./src/statusbar");
const { generateProblems } = require("./src/generateProblems");
const {
  checkConfiguration,
  checkPaths,
  resetPaths,
} = require("./src/configuration");
const cp = require("child_process");
const path = require("path");

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
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("ck3tiger");

  let runCk3tigerCommand = vscode.commands.registerCommand(
    "ck3tiger-for-vscode.runCk3tiger",
    async () => {
      const { ck3_path, ck3tiger_path, mod_path } = await checkPaths(logger);

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Window,
          title: "ck3tiger",
          cancellable: false,
        },
        async (progress) => {
          progress.report({
            message: `Running ck3tiger`,
          });

          const log_path = path.join(
            path.parse(ck3tiger_path).dir,
            "tiger.json"
          );

          await new Promise((resolve, reject) => {
            cp.exec(
              `"${ck3tiger_path}" --ck3 "${ck3_path}" --json "${mod_path}" > "${log_path}"`,
              (err, stdout, stderr) => {
                if (err) {
                  reject(err);
                }
                resolve(stdout);
              }
            );
          });

          progress.report({
            message: "Loading tiger.json",
          });

          // read file:
          const log_file = await vscode.workspace.fs.readFile(
            vscode.Uri.file(log_path)
          );
          const string_log_file = Buffer.from(log_file).toString();

          // todo: fix this hack
          // !warning - is it a hack because json is not valid, it has trailing comma at the end of the array, so wait til amtep will fix it
          const modified = string_log_file.replace(/,\n]\n$/, "]");

          const log_data = JSON.parse(modified);

          progress.report({
            message: "Generating problems",
          });

          const problems = await generateProblems(
            diagnosticCollection,
            log_data
          );
        }
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

  context.subscriptions.push(runCk3tigerCommand, resetPathsCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
