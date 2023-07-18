const vscode = require("vscode");

/**
 * @param {vscode.DiagnosticCollection} diagnosticCollection
 */
function generateProblems(diagnosticCollection) {
  diagnosticCollection.clear();

  const problems = [
    {
      range: new vscode.Range(1, 0, 1, 5),
      message: "Error: Something went wrong",
      severity: vscode.DiagnosticSeverity.Error,
    },
    {
      range: new vscode.Range(3, 2, 3, 8),
      message: "Warning: Potential issue",
      severity: vscode.DiagnosticSeverity.Warning,
    },
    {
      range: new vscode.Range(5, 1, 5, 6),
      message: "Info: Additional information",
      severity: vscode.DiagnosticSeverity.Information,
    },
  ];

  const diagnostics = problems.map((problem) => {
    const diagnostic = new vscode.Diagnostic(
      problem.range,
      problem.message,
      problem.severity
    );
    diagnostic.source = "ck3tiger";
    return diagnostic;
  });

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const activeDocumentUri = activeEditor.document.uri;
    diagnosticCollection.set(activeDocumentUri, diagnostics);
  }
}

exports.generateProblems = generateProblems;
