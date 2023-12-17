const vscode = require('vscode');
const { addConsole } = require('./consoleKey.js');
// 时间状态栏
const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
let startTime;
function updateStatusBar() {
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
// 获取提醒时间
function getReminderTime(context){
	if(!context.globalState.get('timeInMinutes')){
		context.globalState.update('timeInMinutes', 30);
		return 30 * 60 * 1000
	} else {
		const storedTimeInMinutes = context.globalState.get('timeInMinutes');
		console.log('已存储的时间：', storedTimeInMinutes);
		let timer = storedTimeInMinutes * 60 * 1000; // 转换为毫秒
		return timer;
	}
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
if (!context.globalState.get('username')) {
		vscode.window.showInputBox({
				prompt: "请输入您的用户名"
		}).then(username => {
				context.globalState.update('username', username);
				console.log('用户名已存储：', username);
		});
		vscode.window.showInformationMessage('请在上方输入框输入您的用户名哦');
} else {
		const storedUsername = context.globalState.get('username');
		console.log('已存储的用户名：', storedUsername);
		setInterval(function() {
				vscode.window.showInformationMessage('^_^嗨！'+storedUsername+',你已经坐了半个小时啦！别盯着电脑了,看看远处吧！', '我知道了')
		},  getReminderTime(context));
}
	   // 注册设置用户姓名命令
let setUserName = vscode.commands.registerCommand('reminder.setUserName', () => {
			vscode.window.showInputBox({
					prompt: "请输入您的新用户名"
			}).then(newUsername => {
					// 更新用户名到全局状态
					context.globalState.update('username', newUsername);	
					vscode.window.showInformationMessage('用户名已更新为：' + newUsername);
					vscode.commands.executeCommand('workbench.action.reloadWindow')
					console.log('用户名已更新为：', newUsername);
			});
	});
// 注册设置提醒时间命令
let setReminderTime = vscode.commands.registerCommand('reminder.setReminderTime', () => {
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
					console.log('提醒时间已更新为：', newTimeInMinutes);

			});
	});
	startTime = new Date().getTime();

  setInterval(updateStatusBar, 1000);

   // 注册 “一键插入log” 的命令 
	let consoleKey = vscode.commands.registerCommand('reminder.addConsole', addConsole);
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
	deactivate
}
