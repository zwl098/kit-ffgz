const vscode = require("vscode");
const { addConsole } = require("./consoleKey.js");
const { updateStatusBar, statusBar } = require("./updateStatusBar.js");
const { setTime } = require("./setReminderTime.js");
const { setAccount } = require("./setUser.js");
const { ZH_EN_translater } = require("./translate.js");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const setReminderTime = setTime(context);
  const setUserName = setAccount(context);
  // 注册 “一键插入log” 的命令
  const consoleKey = vscode.commands.registerCommand("reminder.addConsole", addConsole);
  setInterval(updateStatusBar, 1000);
  ZH_EN_translater(context);
  context.subscriptions.push(consoleKey);
  context.subscriptions.push(statusBar);
  context.subscriptions.push(setUserName);
  context.subscriptions.push(setReminderTime);
}

function deactivate() {
  statusBar.dispose();
}

module.exports = {
  activate,
  deactivate,
};
