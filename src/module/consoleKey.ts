import * as vscode from "vscode";

export const consoleKey = vscode.commands.registerCommand("reminder.addConsole", async function () {
  const editor = vscode.window.activeTextEditor
  if (!editor) return;

  const config = vscode.workspace.getConfiguration("reminder");
  const suffix = config.get<string>("suffix");
  const fixStyle = config.get<string>("fixStyle");
  const isCursor = config.get<boolean>("isCursor");

  const textArray: string[] = []

  // Handle cursor expansion if isCursor is enabled
  if (isCursor) {
    editor.selections = editor.selections.map(selection => {
      const position = selection.active;
      const wordRange = editor.document.getWordRangeAtPosition(position);
      if (wordRange) {
        return new vscode.Selection(wordRange.start, wordRange.end);
      }
      return selection;
    });
  }

  const ranges = editor.selections;

  ranges.forEach(range => {
    const text = editor.document.getText(range);
    let insertText = "console.log();";
    if (text) {
      const escapedText = text.replace(/'/g, '"');
      if (fixStyle) {
        insertText = `console.log('${suffix}${escapedText} : ', '${fixStyle}', ${text});`;
      } else {
        insertText = `console.log('${suffix}${escapedText}:' , ${text});`;
      }
    }
    textArray.push(insertText);
  });

  // Insert new lines and text
  await vscode.commands.executeCommand("editor.action.insertLineAfter");
  const newEditor = vscode.window.activeTextEditor;
  if (!newEditor) return;

  // Re-fetch selections as they might have changed after insertLineAfter
  const currentSelections = newEditor.selections;

  newEditor.edit(editBuilder => {
    currentSelections.forEach((selection, index) => {
      // We use the start of the current selection because insertLineAfter moves the cursor to the new line
      if (index < textArray.length) {
        editBuilder.insert(selection.start, textArray[index]);
      }
    });
  });
});
