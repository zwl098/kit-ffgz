const vscode = require("vscode");
const { getReminderTime } = require("./setReminderTime.js");
/*
 * 设置用户姓名
 **/
function setAccount(context) {
  if (!context.globalState.get("username")) {
    vscode.window
      .showInputBox({
        prompt: "请输入您的用户名",
      })
      .then(username => {
        context.globalState.update("username", username);
      });
    vscode.window.showInformationMessage("请在上方输入框输入您的用户名哦");
  } else {
    const storedUsername = context.globalState.get("username");
    setInterval(function () {
      vscode.window.showInformationMessage("^_^嗨！" + storedUsername + ",你已经坐了半个小时啦！别盯着电脑了,看看远处吧！", "我知道了");
    }, getReminderTime(context));
  }
  // 注册设置用户姓名命令
  let setUserName = vscode.commands.registerCommand("reminder.setUserName", () => {
    vscode.window
      .showInputBox({
        prompt: "请输入您的新用户名",
      })
      .then(newUsername => {
        // 更新用户名到全局状态
        context.globalState.update("username", newUsername);
        vscode.window.showInformationMessage("用户名已更新为：" + newUsername);
        vscode.commands.executeCommand("workbench.action.reloadWindow");
      });
  });
  return setUserName;
}
module.exports = {
  setAccount,
};
