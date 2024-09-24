const vscode = require('vscode');
let clearCommments = vscode.commands.registerCommand('reminder.removeComments', () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const fullText = document.getText();
    // 正则表达式匹配单行和多行注释
    const newText = fullText.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    // 替换文档内容
    editor.edit(editBuilder => {
      const lastLine = document.lineAt(document.lineCount - 1);
      const fullRange = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.range.end.character);
      editBuilder.replace(fullRange, newText);
    });
  }
});
module.exports = {
  clearCommments
}
