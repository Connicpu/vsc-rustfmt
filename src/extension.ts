import * as vscode from 'vscode';
import * as child_process from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	var disposable = vscode.commands.registerTextEditorCommand("extension.rustfmt", (editor: vscode.TextEditor) => {
		editor.document.save().then((fulfilled: boolean) => {
			let file = editor.document.fileName;
			let result = child_process.spawnSync("rustfmt", ["--write-mode", "overwrite", file]);
			
			if (result.error) {
				vscode.window.showErrorMessage(result.error.toString());
			} else {
				if (result.stderr.toString().length != 0) {
					vscode.window.showErrorMessage("Something went wrong during formatting");
				} else {
					vscode.window.showInformationMessage("Formatted!");
				}
			}
		});
	});
	
	context.subscriptions.push(disposable);
}
