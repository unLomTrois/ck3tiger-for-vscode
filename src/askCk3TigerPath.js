const vscode = require("vscode");
const path = require("path");

/**
 * @param {vscode.WorkspaceConfiguration} configuration
 * @returns {Promise<string | null>}
 */
async function askCK3TigerPath(configuration) {
  return await vscode.window
    .showInformationMessage("🐯 Let's find ck3tiger binary", "Open")
    .then(async (selection) => {
      if (selection === "Open") return await selectCK3TigerPath(configuration);
    });
}

/**
 * @param {vscode.WorkspaceConfiguration} configuration
 * @returns {Promise<string | null>}
 */
async function selectCK3TigerPath(configuration) {
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: {
      Binaries: ["bin", "exe", "bat", "sh", "cmd"],
    },
    title: "Select ck3tiger binary",
    openLabel: "Select ck3tiger binary",
  });

  if (!fileUri) {
    return null;
  }

  const ck3tigerPath = fileUri[0].fsPath;
  const parsedPath = path.parse(ck3tigerPath);

  if (parsedPath.name.toLowerCase() !== "ck3-tiger") {
    vscode.window.showErrorMessage(
      `The selected file ${parsedPath.name} is not named 'ck3-tiger'. Please select the 'ck3-tiger' binary file.`
    );
    return null;
  }

  configuration.update(
    "ck3tiger.path",
    ck3tigerPath,
    vscode.ConfigurationTarget.Global
  );

  return ck3tigerPath;
}

module.exports = {
  askCK3TigerPath,
};
