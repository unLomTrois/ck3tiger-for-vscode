const vscode = require("vscode");

/**
 * @param {vscode.DiagnosticCollection} diagnosticCollection
 * @param {object[]} log_data
 * @returns {Promise<vscode.DiagnosticCollection | null>}
 */
async function generateProblems(diagnosticCollection, log_data) {
  diagnosticCollection.clear();

  const diagnosticsByFile = {};

  log_data.forEach((problem) => {
    try {
      const location = problem.locations[0];

      // skip if line is null
      if (location.linenr === null) {
        console.log("Skipping problem with null line number");
        console.log(problem);

        return;
      }

      const filePath = location.fullpath;

      // Create an array of diagnostics for the current file if it doesn't exist
      if (!diagnosticsByFile[filePath]) {
        diagnosticsByFile[filePath] = [];
      }

      let severity;

      switch (problem.severity) {
        case "tips":
          severity = vscode.DiagnosticSeverity.Hint;
          break;
        case "untidy":
          severity = vscode.DiagnosticSeverity.Information;
          break;
        case "warning":
          severity = vscode.DiagnosticSeverity.Warning;
          break;
        case "error":
          severity = vscode.DiagnosticSeverity.Error;
          break;
        case "fatal":
          severity = vscode.DiagnosticSeverity.Error;
          break;
        default:
          severity = vscode.DiagnosticSeverity.Error;
          break;
      }

      // Create a diagnostic for the current problem
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(
          location.linenr - 1,
          location.column - 1,
          location.linenr - 1,
          location.length
            ? location.column - 1 + location.length
            : location.line.length
        ),
        problem.message,
        severity
      );
      diagnostic.source = "ck3tiger";
      diagnostic.code = problem.key;

      // Add the diagnostic to the array for the current file
      diagnosticsByFile[filePath].push(diagnostic);
    } catch (error) {
      console.log(error);
      console.log(problem);
      vscode.window.showErrorMessage(
        "Something went wrong while generating diagnostics"
      );
      return;
    }
  });

  console.log(diagnosticsByFile);

  // Update the diagnostic collection for each file
  for (const [filePath, diagnostics] of Object.entries(diagnosticsByFile)) {
    diagnosticCollection.set(vscode.Uri.file(filePath), diagnostics);
  }

  return diagnosticCollection;
}

exports.generateProblems = generateProblems;
