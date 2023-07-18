const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function initStatusBarButton(context) {
  const statusBarButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarButton.text = "🐯Run ck3tiger🐯";
  statusBarButton.tooltip = "Run ck3tiger (tooltip)";
  statusBarButton.command = "ck3tiger-for-vscode.runCk3tiger";
  statusBarButton.show();
  context.subscriptions.push(statusBarButton);
}
exports.initStatusBarButton = initStatusBarButton;
