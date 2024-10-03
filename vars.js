const Utils = require("./utils");

const IP = "192.168.15.1";
const user = "admin";
const pass = "SENHA_AQUI";

const browser = "chrome";
const browserPaths = {
	win32: {
		firefox: "C:/Program Files/Mozilla Firefox/firefox.exe",
		chrome: "C:/Program Files/Google/Chrome/Application/chrome.exe",
		edge: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
	},
	linux: {
		firefox: "/snap/firefox/current/usr/lib/firefox/firefox",
		chrome: "/usr/bin/google-chrome",
	},
	darwin: {
			firefox: "/Applications/Firefox.app/Contents/MacOS/firefox",
			chrome: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --kiosk"
	}
};

exports.IP = IP;
exports.user = Utils.messUserPass(user);
exports.pass = Utils.messUserPass(pass);
exports.browserPaths = browserPaths;
exports.browser = browser;
