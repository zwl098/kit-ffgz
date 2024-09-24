const vscode = require('vscode');
let clearEmptyLines = vscode.commands.registerCommand('reminder.clearEmptyLines', function () {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const lineCount = document.lineCount;
		let edits = [];
		let deletedLineCount = 0;
		for (let lineNumber = 0; lineNumber < lineCount; lineNumber++) {
			const line = document.lineAt(lineNumber);
			if (line.isEmptyOrWhitespace) {
				const edit = new vscode.TextEdit(line.rangeIncludingLineBreak, '');
				edits.push(edit);
				deletedLineCount++;
			}
		}
		if (edits.length > 1) {
			const workspaceEdit = new vscode.WorkspaceEdit();
			workspaceEdit.set(document.uri, edits);
			vscode.workspace.applyEdit(workspaceEdit).then(() => {
				vscode.window.showInformationMessage(`Deleted ${deletedLineCount - 1} empty line(s).`);
			});
		} else {
			vscode.window.showInformationMessage('No empty lines found.');
		}
	}
});

module.exports = {
	clearEmptyLines
}
