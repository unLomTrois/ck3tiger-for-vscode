const vscode = require("vscode");

/**
 * @param {vscode.WorkspaceConfiguration} configuration
 * @returns {Promise<string | null>}
 */
async function askCK3Path(configuration) {
  return await vscode.window
    .showInformationMessage("🐯 Let's set path to CK3/game folder", "Open")
    .then(async (selection) => {
      if (selection === "Open") return await selectCK3Path(configuration);
    });
}

/**
 * @param {vscode.WorkspaceConfiguration} configuration
 * @returns {Promise<string | null>}
 */
async function selectCK3Path(configuration) {
  // todo: make one for linux
  const defaultFolderPath =
    "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Crusader Kings III\\game";

  const folderUri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    title: "Select vanilla ck3 folder",
    openLabel: "Select CK3/game Folder",
    defaultUri: vscode.Uri.file(defaultFolderPath),
  });

  console.log("folderUri", folderUri);

  if (!folderUri) {
    return null;
  }

  const ck3Path = folderUri[0].fsPath;
  configuration.update("ck3.path", ck3Path, vscode.ConfigurationTarget.Global);

  return ck3Path;
}

exports.askCK3Path = askCK3Path;
