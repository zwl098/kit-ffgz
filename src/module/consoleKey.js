// -- index.js (入口文件)

const vscode = require("vscode");

async function addConsole() {
  // 只需要加这一行，在开启其他逻辑之前先调用内置命令"cursorWordLeftSelect"
  // 需要注意的是，所有命令返回的都是promise，所以需要加个 async await 等待一下
  // api 废弃,停用
  // await vscode.commands.executeCommand("cursorWordLeftSelect"); 
  // 获取当前打开的文件的editor
  const editor = vscode.window.activeTextEditor;
  // editor === undefind 表示没有打开的文件
  if (!editor) return;
  const textArray = [];
  // 当前被选中文本的位置信息数组（实际上就是range组成的数组）
  const Ranges = editor.selections;
  console.log(Ranges);
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
        insertText = `console.log('${suffix}${text.replace(/'/g, '"')} : ' , ${text});`;
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
      // 通过range拿到start位置的position
      const position = new vscode.Position(range.start.line, range.start.character);
      positionList.push(position);
    });
    // 编辑当前文件
    editor.edit(editBuilder => {
      positionList.forEach((position, index) => {
        // 通过”坐标点“插入我们之前预设好的log文本
        editBuilder.insert(position, textArray[index]);
      });
    });
  });
}

module.exports = {
  addConsole,
};
