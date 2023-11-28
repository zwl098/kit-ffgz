const vscode = require('vscode');

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
  statusBar.text = `Time: ${displayText}`;
  statusBar.show();
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
		let timeInMinutes = 30; // 设置你的提醒时间
		let timer = timeInMinutes * 60 * 1000; // 转换为毫秒
		// let timer= 3000
		setInterval(function() {
				vscode.window.showInformationMessage('^_^嗨！'+storedUsername+',你已经坐了半个小时啦！别盯着电脑了,看看远处吧！', '我知道了')
		}, timer);
}
	   // 注册命令
let disposable = vscode.commands.registerCommand('reminder.setUserName', () => {
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

	context.subscriptions.push(disposable);

	startTime = new Date().getTime();

  setInterval(updateStatusBar, 1000);

  context.subscriptions.push(statusBar);
}
function deactivate() {

	statusBar.dispose();
}

module.exports = {
	activate,
	deactivate
}
