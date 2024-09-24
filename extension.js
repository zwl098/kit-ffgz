const vscode = require("vscode");
const { consoleKey } = require("./src/module/consoleKey.js");
const { updateStatusBar, statusBar } = require("./src/module/updateStatusBar.js");
const { setTime } = require("./src/module/setReminderTime.js");
const { setAccount } = require("./src/module/setUser.js");
const { ZH_EN_translater } = require("./src/module/translate.js");
const { removeConsole } = require("./src/module/removeConsole.js")
const { clearEmptyLines } = require("./src/module/removeEmptyLine.js")
const { clearCommments } = require("./src/module/removeComments.js")
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const showStatusBar = vscode.workspace.getConfiguration().get("reminder.showStatusBar");
  const setReminderTime = setTime(context);
  const setUserName = setAccount(context);
  ZH_EN_translater(context);
  showStatusBar && setInterval(updateStatusBar, 1000);
  showStatusBar && context.subscriptions.push(statusBar);
  context.subscriptions.push(consoleKey);
  context.subscriptions.push(setUserName);
  context.subscriptions.push(setReminderTime);
  context.subscriptions.push(removeConsole);
  context.subscriptions.push(clearEmptyLines);
  context.subscriptions.push(clearCommments);
}
function deactivate() {
  statusBar.dispose();
}
module.exports = {
  activate,
  deactivate,
};
