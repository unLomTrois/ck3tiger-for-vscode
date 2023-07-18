const vscode = require("vscode");
const { askCK3TigerPath } = require("./askCk3TigerPath");
const { askCK3Path } = require("./askCK3Path");

/**
 * @param {vscode.OutputChannel} logger
 */

async function checkConfiguration(logger) {
  logger.appendLine("Checking configuration");

  const configuration = vscode.workspace.getConfiguration("ck3tiger");

  await checkPaths(logger);

  return configuration;
}

/**
 * @param {vscode.OutputChannel} logger
 * @returns {Promise<{ck3tiger_path: string, ck3_path: string}>}
 */
async function checkPaths(logger) {
  logger.appendLine("Checking paths...");

  const configuration = vscode.workspace.getConfiguration("ck3tiger");

  let ck3tiger_path = await configuration.get("ck3tiger.path");
  logger.appendLine(
    `ck3tiger_path is ${ck3tiger_path} with typeof ${typeof ck3tiger_path}`
  );
  if (!ck3tiger_path) {
    logger.appendLine("No configuration found for ck3tiger.path");
    ck3tiger_path = await askCK3TigerPath(configuration);
  }

  let ck3_path = await configuration.get("ck3.path");
  logger.appendLine(`ck3_path is ${ck3_path} with typeof ${typeof ck3_path}`);
  if (!ck3_path) {
    logger.appendLine("No configuration found for ck3.path");
    ck3_path = await askCK3Path(configuration);
  }

  return { ck3tiger_path, ck3_path };
}

/**
 * @param {vscode.OutputChannel} logger
 */
async function resetPaths(logger) {
  logger.appendLine("Resetting paths");

  const configuration = vscode.workspace.getConfiguration("ck3tiger");

  await configuration.update(
    "ck3tiger.path",
    undefined,
    vscode.ConfigurationTarget.Global
  );
  await configuration.update(
    "ck3.path",
    undefined,
    vscode.ConfigurationTarget.Global
  );
}

module.exports = { checkConfiguration, checkPaths, resetPaths };
