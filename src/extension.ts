import * as vscode from "vscode";
import { consoleKey } from "./module/consoleKey";
import { startStatusBarTimer } from "./module/updateStatusBar";
import { setTime } from "./module/setReminderTime";
import { setAccount } from "./module/setUser";
import { ZH_EN_translater } from "./module/translate";
import { removeConsole } from "./module/removeConsole";
import { clearEmptyLines } from "./module/removeEmptyLine";
import { clearCommments } from "./module/removeComments";
import { setDailyReminder, disposeReminder } from "./module/timeReminder";

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
  const showStatusBar = vscode.workspace.getConfiguration().get("reminder.showStatusBar");
  const setReminderTime = setTime(context);
  const setUserName = setAccount(context);
  ZH_EN_translater(context);

  if (showStatusBar) {
    // Use the new startStatusBarTimer which returns a disposable that cleans up the interval
    context.subscriptions.push(startStatusBarTimer());
  }

  context.subscriptions.push(consoleKey);
  context.subscriptions.push(setUserName);
  context.subscriptions.push(setReminderTime);
  context.subscriptions.push(removeConsole);
  context.subscriptions.push(clearEmptyLines);
  context.subscriptions.push(clearCommments);
  context.subscriptions.push(setDailyReminder);

  // Register the daily reminder disposal
  context.subscriptions.push(disposeReminder());

  vscode.commands.executeCommand('reminder.setDailyReminder')
}
export function deactivate() {
  // All resources are effectively managed by context.subscriptions
}
