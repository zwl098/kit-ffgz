const vscode = require("vscode");
let setDailyReminder = vscode.commands.registerCommand('reminder.setDailyReminder', () => {
  // 目标时间固定为 18:00
  const targetHours = 18;
  const targetMinutes = 0;
  // 获取当前时间
  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  // 目标时间的分钟数
  const targetTimeInMinutes = targetHours * 60 + targetMinutes;
  console.log(currentTimeInMinutes);
  console.log(targetTimeInMinutes);
  let delayInMilliseconds;
  if (targetTimeInMinutes <= currentTimeInMinutes) {
    // 如果当前时间已经过了18:00，设置为第二天的18:00
    delayInMilliseconds = (24 * 60 - currentTimeInMinutes + targetTimeInMinutes) * 60 * 1000;
  } else {
    // 如果当前时间未到18:00
    delayInMilliseconds = (targetTimeInMinutes - currentTimeInMinutes) * 60 * 1000;
  }
  vscode.window.showInformationMessage('提醒已设置，每天18:00会提醒您！');
  // 设置定时器提醒
  setTimeout(() => {
    vscode.window.showInformationMessage('下班时间到了！今天的班就上的这吧,再上就不礼貌啦!');
    // 每天重新设置提醒
    scheduleNextReminder();
  }, delayInMilliseconds);
});
function scheduleNextReminder() {
  const targetHours = 18;
  const targetMinutes = 0;
  // 下一次提醒的时间为第二天的18:00
  const now = new Date();
  const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, targetHours, targetMinutes, 0);
  const delayInMilliseconds = targetTime.getTime() - now.getTime();
  setTimeout(() => {
    vscode.window.showInformationMessage('下班时间到了！今天的班就上的这吧,再上就不礼貌啦!');
    // 继续设置下一次提醒
    scheduleNextReminder();
  }, delayInMilliseconds);
}
module.exports = {
  setDailyReminder,
  scheduleNextReminder
};

