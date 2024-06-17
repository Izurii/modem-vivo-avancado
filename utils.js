const Vars = require("./vars");

const WebDriver = require("selenium-webdriver");
const seleniumEdge = require("selenium-webdriver/edge");
const seleniumChrome = require("selenium-webdriver/chrome");
const seleniumFirefox = require("selenium-webdriver/firefox");

function messUserPass(str) {
	return str
		.split("")
		.map(function (c) {
			return String.fromCharCode(c.charCodeAt(0) ^ 0x1f);
		})
		.join("");
}

function getPlatform() {
	return process.platform;
}

function setWebdriverBrowser(driver, browser, path) {
	switch (browser) {
		case "firefox":
			const firefoxOptions = new seleniumFirefox.Options();
			firefoxOptions.setBinary(path);
			driver.forBrowser(WebDriver.Browser.FIREFOX).setFirefoxOptions(firefoxOptions);
			break;
		case "chrome":
			const chromeOptions = new seleniumChrome.Options();
			chromeOptions.setChromeBinaryPath(path);
			chromeOptions.addArguments("--start-maximized");
			chromeOptions.excludeSwitches("enable-automation");
			driver.forBrowser(WebDriver.Browser.CHROME).setChromeOptions(chromeOptions);
			break;
		case "edge":
			const edgeOptions = new seleniumEdge.Options();
			edgeOptions.setEdgeChromiumBinaryPath(path);
			edgeOptions.addArguments("--start-maximized");
			edgeOptions.excludeSwitches("enable-automation");
			driver.forBrowser(WebDriver.Browser.EDGE).setEdgeOptions(edgeOptions);
			break;
	}
}

function getWebDriver(platform) {
	const driver = new WebDriver.Builder();

	const browserPaths = Vars.browserPaths[platform];
	if (!browserPaths) {
		console.error("Sistema operacional não suportado.");
		process.exit(1);
	}

	const path = browserPaths[Vars.browser];
	if (!path) {
		console.error("Navegador não suportado.");
		process.exit(1);
	}

	setWebdriverBrowser(driver, Vars.browser, path);

	return driver.build();
}

exports.messUserPass = messUserPass;
exports.getWebDriver = getWebDriver;
exports.getPlatform = getPlatform;
