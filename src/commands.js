const vscode = require("vscode");
const { generateProblems } = require("./generateProblems");
const { checkPaths, resetPaths } = require("./configuration");
const cp = require("child_process");
const path = require("path");

/**
 * @param {vscode.OutputChannel} logger
 * @param {vscode.DiagnosticCollection} diagnosticCollection
 */
function runCK3TigerCommand(logger, diagnosticCollection) {
  return vscode.commands.registerCommand(
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

          await runCK3Tiger(ck3tiger_path, ck3_path, mod_path, log_path);

          progress.report({
            message: "Loading tiger.json",
          });

          // read file:
          const log_data = await readTigerLog(vscode.Uri.file(log_path));

          progress.report({
            message: "Generating problems",
          });

          generateProblems(diagnosticCollection, log_data);
        }
      );
    }
  );
}

/**
 * @param {string} ck3tiger_path
 * @param {string} ck3_path
 * @param {string} mod_path
 * @param {string} log_path
 */
async function runCK3Tiger(ck3tiger_path, ck3_path, mod_path, log_path) {
  await new Promise((resolve, reject) => {
    cp.exec(
      `"${ck3tiger_path}" --ck3 "${ck3_path}" --json "${mod_path}" > "${log_path}"`,
      (err, stdout) => {
        if (err) {
          reject(err);
        }
        resolve(stdout);
      }
    );
  });
}

/**
 * @param {vscode.OutputChannel} logger
 */
function resetPathsCommand(logger) {
  return vscode.commands.registerCommand(
    "ck3tiger-for-vscode.resetPaths",
    async () => {
      await resetPaths(logger);
      await checkPaths(logger);
    }
  );
}

/**
 * @param {vscode.OutputChannel} logger
 * @param {vscode.DiagnosticCollection} diagnosticCollection
 */
function getProblemsFromLogCommand(logger, diagnosticCollection) {
  return vscode.commands.registerCommand(
    "ck3tiger-for-vscode.getProblemsFromLog",
    async () => {
      const { ck3tiger_path } = await checkPaths(logger);

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Window,
          title: "ck3tiger",
          cancellable: false,
        },
        async (progress) => {
          progress.report({
            message: "Loading tiger.json",
          });

          const log_path = path.join(
            path.parse(ck3tiger_path).dir,
            "tiger.json"
          );

          const log_uri = vscode.Uri.file(log_path);
          try {
            await vscode.workspace.fs.stat(log_uri);
            vscode.window.showTextDocument(log_uri, {
              viewColumn: vscode.ViewColumn.Beside,
            });
          } catch (e) {
            vscode.window.showErrorMessage(
              "tiger.json doesn't exist. Run ck3tiger first."
            );
            vscode.window.showInformationMessage(
              "tiger.json must be in the same folder as ck3tiger binary"
            );
            return;
          }

          // read file:
          const log_data = await readTigerLog(log_uri);

          progress.report({
            message: "Generating problems",
          });

          generateProblems(diagnosticCollection, log_data);
        }
      );
    }
  );
}

/**
 * @param {vscode.Uri} log_uri
 */
async function readTigerLog(log_uri) {
  const log_file = await vscode.workspace.fs.readFile(log_uri);
  const log_data = JSON.parse(Buffer.from(log_file).toString());
  return log_data;
}

module.exports = {
  resetPathsCommand,
  runCK3TigerCommand,
  getProblemsFromLogCommand,
};
