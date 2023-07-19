const vscode = require("vscode");
const path = require("path");

/**
 * @param {vscode.WorkspaceConfiguration} configuration
 * @returns {Promise<string | null>}
 */
async function askModPath(configuration) {
  return await vscode.window
    .showInformationMessage("🐯 And where is your .mod file?", "Open")
    .then(async (selection) => {
      if (selection === "Open") return await selectModPath(configuration);
    });
}

/**
 * @param {vscode.WorkspaceConfiguration} configuration
 * @returns {Promise<string | null>}
 */
async function selectModPath(configuration) {
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: {
      Mod: ["mod"],
    },
    openLabel: "Select your .mod file",
  });

  console.log("folderUri", fileUri);

  if (!fileUri) {
    return null;
  }

  const modPath = fileUri[0].fsPath;
  configuration.update("mod.path", modPath, vscode.ConfigurationTarget.Global);

  return modPath;
}

exports.askModPath = askModPath;
