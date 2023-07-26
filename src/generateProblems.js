const vscode = require("vscode");

/**
 * @param {vscode.DiagnosticCollection} diagnosticCollection
 * @param {object[]} log_data
 * @returns {vscode.DiagnosticCollection | null}
 */
function generateProblems(diagnosticCollection, log_data) {
  diagnosticCollection.clear();

  const diagnosticsByFile = handleProblems(log_data);

  // console.log(diagnosticsByFile);

  // Update the diagnostic collection for each file
  for (const [filePath, diagnostics] of Object.entries(diagnosticsByFile)) {
    diagnosticCollection.set(vscode.Uri.file(filePath), diagnostics);
  }

  return diagnosticCollection;
}

/**
 * @param {object[]} problems
 */
function handleProblems(problems) {
  const diagnosticsByFile = {};

  problems.forEach((problem) => {
    handleProblem(problem, diagnosticsByFile);
  });

  return diagnosticsByFile;
}

function handleProblem(problem, diagnosticsByFile) {
  try {
    const location = problem.locations[0];

    // skip if line is null
    if (location.linenr === null) {
      if (problem.key !== "colors") {
        console.log("Skipping problem with null line number");
        console.log(problem);
      }

      return;
    }

    const filePath = location.fullpath;

    // Create an array of diagnostics for the current file if it doesn't exist
    if (!diagnosticsByFile[filePath]) {
      diagnosticsByFile[filePath] = [];
    }

    const diagnostic = handleLocation(problem, location);

    diagnosticsByFile[filePath].push(diagnostic);
  } catch (error) {
    console.log(error);
    console.log(problem);
    vscode.window.showErrorMessage(
      "Something went wrong while generating diagnostics"
    );
    return;
  }
}

function handleLocation(problem, location) {
  const severity = setSeverity(problem);

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

  return diagnostic;
}

/**
 * @param {{ severity: string; }} problem
 */
function setSeverity(problem) {
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
  return severity;
}

exports.generateProblems = generateProblems;
