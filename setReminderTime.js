// 注册设置提醒时间命令
const vscode = require('vscode');
function setTime(context){
  var setReminderTime = vscode.commands.registerCommand('reminder.setReminderTime', () => {
    vscode.window.showInputBox({
        prompt: "请输入您的新提醒时间（单位：分钟）"
    }).then((newTimeInMinutes) => {
      // 判断输入是否为空
      if(!newTimeInMinutes){
        vscode.window.showInformationMessage('提醒时间未更新');
        return;
      }
      if(typeof newTimeInMinutes !== 'number' || isNaN(newTimeInMinutes)){
        vscode.window.showInformationMessage('想什么呢！请输入数字');
        return;
      }
      if(newTimeInMinutes < 1){
        vscode.window.showInformationMessage('想什么呢！请输入大于0的数字');
        return;
      }
      if(newTimeInMinutes > 60){
        vscode.window.showInformationMessage('想什么呢！请输入小于60的数字');
        return;
      }
        // 更新用户名到全局状态
        context.globalState.update('timeInMinutes', newTimeInMinutes);	
        vscode.window.showInformationMessage('提醒时间已更新为：' + newTimeInMinutes + '分钟');
        vscode.commands.executeCommand('workbench.action.reloadWindow')
    });
  });
  return setReminderTime;
}
// 获取提醒时间
function getReminderTime(context){
	if(!context.globalState.get('timeInMinutes')){
		context.globalState.update('timeInMinutes', 30);
		return 30 * 60 * 1000
	} else {
		const storedTimeInMinutes = context.globalState.get('timeInMinutes');
		let timer = storedTimeInMinutes * 60 * 1000; // 转换为毫秒
		return timer;
	}
}
module.exports = {
  setTime,
  getReminderTime
};
