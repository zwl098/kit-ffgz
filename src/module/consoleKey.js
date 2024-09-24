// -- index.js (入口文件)
const vscode = require("vscode");
const consoleKey = vscode.commands.registerCommand("reminder.addConsole", async function () {
  const editor = vscode.window.activeTextEditor
  if (!editor) return;
  const textArray = []
  await vscode.commands.executeCommand('editor.action.addSelectionToNextFindMatch')
  const Ranges = editor.selections
  // 用”属性标识“ 分别获取属性 “前缀” 和 “样式“
  const suffix = vscode.workspace.getConfiguration().get("reminder.suffix");
  const fixStyle = vscode.workspace.getConfiguration().get("reminder.fixStyle");
  Ranges.forEach(range => {
    // 通过位置信息拿到被选中的文本，然后拼接要插入的log
    const text = editor.document.getText(range);
    let insertText = "console.log();";
    if (text) {
      // 使用自定义属性 ”前缀“(suffix) 和 ”样式“(fixStyle) 来拼接log
      insertText = `console.log('${suffix}${text.replace(/'/g, '"')} : ', '${fixStyle}', ${text});`;
      if (fixStyle === "") {
        insertText = `console.log('${suffix}${text.replace(/'/g, '"')}:' , ${text});`;
      }
    }
    textArray.push(insertText);
  });

  // “光标换行” 调用vscode内置的换行命令，所有focus的光标都会换行
  vscode.commands.executeCommand("editor.action.insertLineAfter").then(() => {
    const editor = vscode.window.activeTextEditor;
    const Ranges = editor.selections;
    const positionList = [];
    Ranges.forEach((range, index) => {
      const position = new vscode.Position(range.start.line, range.start.character);
      positionList.push(position);
    });
    editor.edit(editBuilder => {
      positionList.forEach((position, index) => {
        editBuilder.insert(position, textArray[index]);
      });
    });
  });
});

module.exports = {
  consoleKey
};
