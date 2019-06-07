import * as vscode from 'vscode';
import { HtmlValidate, Config, ConfigLoader } from 'html-validate'

const WARN = 1;
const ERROR = 2;

export function activate(context: vscode.ExtensionContext) {

	let timeout: NodeJS.Timer | undefined = undefined;

	const errorDecorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: "#FF000055",
	});

	const warnDecorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: "#FFFF0055",
	});

	let activeEditor = vscode.window.activeTextEditor;
	const loader = new ConfigLoader(Config);

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}

		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			return;
		}

		let htmlValidate: HtmlValidate;
		try {
			const config = loader.fromTarget(activeEditor.document.fileName);
			htmlValidate = new HtmlValidate(config.get());
		} catch (error) {
			htmlValidate = new HtmlValidate();
		}

		const text = activeEditor.document.getText();
		const report = htmlValidate.validateString(text);
		const htmlErrors: vscode.DecorationOptions[] = [];
		const htmlWarnings: vscode.DecorationOptions[] = [];

		for (let i = 0; i < report.results.length; i++) {
			const result = report.results[i];
			for (let j = 0; j < result.messages.length; j++) {
				const message = result.messages[j];
				if (message.severity == WARN) {
					htmlWarnings.push({ range: activeEditor.document.lineAt(message.line - 1).range, hoverMessage: message.message });
				} else if (message.severity == ERROR) {
					htmlErrors.push({ range: activeEditor.document.lineAt(message.line - 1).range, hoverMessage: message.message });
				}
			}
		}
		activeEditor.setDecorations(errorDecorationType, htmlErrors);
		activeEditor.setDecorations(warnDecorationType, htmlWarnings);
	}

	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidSaveTextDocument(event => {
		if (activeEditor && event === activeEditor.document) {
			triggerUpdateDecorations();
		}
	})

	vscode.workspace.onDidChangeTextDocument(event => {
		const configuration = vscode.workspace.getConfiguration('html-validate')
		const runOnEdit = configuration.get("runOnEdit");
		if (runOnEdit) {
			if (activeEditor && event.document === activeEditor.document) {
				triggerUpdateDecorations();
			}
		}
	}, null, context.subscriptions);



}