import * as vscode from "vscode";

function getTargetTime() {
  const config = vscode.workspace.getConfiguration("reminder");
  const timeStr = config.get<string>("dailyReminderTime", "18:00");
  const [hours, minutes] = timeStr.split(":").map(Number);

  if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
    return { hours, minutes };
  }
  return { hours: 18, minutes: 0 };
}

export let setDailyReminder = vscode.commands.registerCommand('reminder.setDailyReminder', () => {
  const { hours: targetHours, minutes: targetMinutes } = getTargetTime();

  // 获取当前时间
  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  // 目标时间的分钟数
  const targetTimeInMinutes = targetHours * 60 + targetMinutes;

  let delayInMilliseconds;
  if (targetTimeInMinutes <= currentTimeInMinutes) {
    // 如果当前时间已经过了目标时间，设置为第二天的目标时间
    delayInMilliseconds = (24 * 60 - currentTimeInMinutes + targetTimeInMinutes) * 60 * 1000;
  } else {
    // 如果当前时间未到目标时间
    delayInMilliseconds = (targetTimeInMinutes - currentTimeInMinutes) * 60 * 1000;
  }

  const timeStr = `${targetHours.toString().padStart(2, '0')}:${targetMinutes.toString().padStart(2, '0')}`;
  vscode.window.showInformationMessage(`提醒已设置，每天${timeStr}会提醒您！`);

  // 设置定时器提醒
  setTimeout(() => {
    vscode.window.showInformationMessage('下班时间到啦！今天的班就先上到这里吧,再上就不礼貌啦!');
    // 每天重新设置提醒
    scheduleNextReminder();
  }, delayInMilliseconds);
});

export function scheduleNextReminder() {
  const { hours: targetHours, minutes: targetMinutes } = getTargetTime();

  // 下一次提醒的时间为第二天的目标时间
  const now = new Date();
  const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, targetHours, targetMinutes, 0);
  const delayInMilliseconds = targetTime.getTime() - now.getTime();
  setTimeout(() => {
    vscode.window.showInformationMessage('下班时间到啦！今天的班就先上到这里吧,再上就不礼貌啦!');
    // 继续设置下一次提醒
    scheduleNextReminder();
  }, delayInMilliseconds);
}

