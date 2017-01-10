import * as vscode from 'vscode';
import * as child_process from 'child_process';

let config;

function formatDocument(document: string) {
	let bin = !config.bin ? 'rustfmt' : config.bin;
	let result = child_process.spawnSync(bin, ['--write-mode', 'overwrite', document]);
	if (result.error) {
		vscode.window.showErrorMessage(result.error.toString());
	} else if(result.stderr.toString().length != 0) {
		let channel = vscode.window.createOutputChannel('Rustfmt Output');
		channel.append(result.stderr.toString());
		channel.show();
	}
}

export function activate(context: vscode.ExtensionContext) {
	config = vscode.workspace.getConfiguration('rustfmt');
	
	// Manual fmt command
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('rustfmt.fmt', editor => {
		editor.document.save().then(fulfilled => {
			formatDocument(editor.document.fileName);
		});
	}));
	
	// Automatic save handler
	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(target => {
		if(/\.rs$/.test(target.fileName) && (config.formatOnSave || true)) {
			formatDocument(target.fileName);
		}
	}));
}
