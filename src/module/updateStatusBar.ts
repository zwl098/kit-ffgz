import * as vscode from 'vscode';
// 时间状态栏
export const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
export let startTime: number;
export function updateStatusBar() {
  const currentTime = new Date().getTime();
  const timeDiff = new Date(currentTime - startTime);
  const hours = timeDiff.getUTCHours();
  const minutes = timeDiff.getUTCMinutes();
  const seconds = timeDiff.getUTCSeconds();
  let displayText = '';
  if (hours > 0) {
    displayText += `${hours.toString().padStart(2, '0')}:`;
  }
  if (minutes > 0 || hours > 0) {
    displayText += `${minutes.toString().padStart(2, '0')}:`;
  }
  displayText += `${seconds.toString().padStart(2, '0')}`;
  statusBar.text = `Recording Time: ${displayText}`;
  statusBar.show();
}
startTime = new Date().getTime();
