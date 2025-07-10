import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";
import * as glob from "glob";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("squompile.compile", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active file.");
      return;
    }
    const file_path = editor.document.fileName;
    if (path.extname(file_path) !== ".cpp") {
      vscode.window.showErrorMessage("Not a C++ file.");
      return;
    }

    const file_dir = path.dirname(file_path);
    const file_name = path.basename(file_path, ".cpp");

    const is_windows = process.platform === "win32";

    const output_name = is_windows ? `${file_name}.exe` : file_name;
    const run_command = is_windows ? `.\\${output_name}` : `./${output_name}`;

    const config = vscode.workspace.getConfiguration("squompile");
    const compileFlags = config.get<string>("compileFlags") || "";

    const cpp_files = glob.sync("**/*.cpp", {
      cwd: file_dir,
      absolute: false,
    });

    if (cpp_files.length === 0) {
      vscode.window.showErrorMessage("No .cpp files found.");
      return;
    }

    const files_string = cpp_files
      .map((f) => `"${path.resolve(file_dir, f)}"`)
      .join(" ");
    const compile_cmd = `g++ ${files_string} ${compileFlags} -o ${output_name}`;

    vscode.window.setStatusBarMessage(
      `$(gear) Compiling ${file_name}...`,
      2000
    );

    const terminal = vscode.window.createTerminal("Compile and Run C++");
    terminal.show();
    terminal.sendText(`cd "${file_dir}"`);
    terminal.sendText(compile_cmd);

    // get error for notification 
    exec(compile_cmd, { cwd: file_dir }, (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(
          `Compilation failed: ${stderr || error.message}`
        );
        vscode.window.setStatusBarMessage(`$(error) Compilation failed`, 3000);
        return;
      }

      vscode.window.setStatusBarMessage(
        `$(check) Compilation successful`,
        3000
      );
      terminal.sendText(run_command);
    });
  });
  context.subscriptions.push(disposable);

  const code_lens_provider = vscode.languages.registerCodeLensProvider("cpp", {
    provideCodeLenses(document) {
      const top_of_file = new vscode.Range(0, 0, 0, 0);
      return [
        new vscode.CodeLens(top_of_file, {
          title: "$(squirrel) Run C++ File",
          command: "squompile.compile",
          tooltip: "Compile and Run this file using Squompile",
        }),
      ];
    },
    resolveCodeLens(codeLens) {
      return codeLens;
    },
  });
  context.subscriptions.push(code_lens_provider);
}
export function deactivate() {}
