const vscode = require("vscode");
const { addConsole } = require("./src/module/consoleKey.js");
const { updateStatusBar, statusBar } = require("./src/module/updateStatusBar.js");
const { setTime } = require("./src/module/setReminderTime.js");
const { setAccount } = require("./src/module/setUser.js");
const { ZH_EN_translater } = require("./src/module/translate.js");
const { removeConsole } = require("./src/module/removeConsole.js")
const { removeEmptyLine } = require("./src/module/removeEmptyLine.js")
var a
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const showStatusBar = vscode.workspace.getConfiguration().get("reminder.showStatusBar");
  const setReminderTime = setTime(context);
  const setUserName = setAccount(context);
  const deleteAllLogStatements = removeConsole()
  const clearEmptyLines = removeEmptyLine()
  // 注册 “一键插入log” 的命令
  const consoleKey = vscode.commands.registerCommand("reminder.addConsole", addConsole);
  showStatusBar && setInterval(updateStatusBar, 1000);
  ZH_EN_translater(context);
  context.subscriptions.push(consoleKey);
  showStatusBar && context.subscriptions.push(statusBar);
  context.subscriptions.push(setUserName);
  context.subscriptions.push(setReminderTime);
  context.subscriptions.push(deleteAllLogStatements);
  context.subscriptions.push(clearEmptyLines);
}

function deactivate() {
  statusBar.dispose();
}

module.exports = {
  activate,
  deactivate,
};
