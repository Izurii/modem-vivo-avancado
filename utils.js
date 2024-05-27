const fs = require("fs");
const WebDriver = require("selenium-webdriver");
const seleniumFirefox = require("selenium-webdriver/firefox");
const seleniumChrome = require("selenium-webdriver/chrome");

function mess_userpass(str) {
  return str
    .split("")
    .map(function (c) {
      return String.fromCharCode(c.charCodeAt(0) ^ 0x1f);
    })
    .join("");
}

function get_platform() {
  return process.platform;
}

function get_available_browser() {
  const platform = get_platform();
  if (platform === "win32") {
    if (fs.existsSync("C:/Program Files/Mozilla Firefox/firefox.exe")) {
      return "firefox-bin-win";
    } else if (
      fs.existsSync("C:/Program Files/Google/Chrome/Application/chrome.exe")
    ) {
      return "chrome-bin-win";
    } else {
      return false;
    }
  } else if (platform === "linux") {
    if (fs.existsSync("/snap/firefox/current/usr/lib/firefox/firefox")) {
      return "firefox-snap-linux";
    } else if (fs.existsSync("/usr/bin/google-chrome")) {
      return "chrome-bin-linux";
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function get_webdriver() {
  let driver = new WebDriver.Builder();

  const browser = get_available_browser();
  if (!browser) {
    console.error("Nenhum navegador disponível.");
    process.exit(1);
  }
  if (browser === "firefox-snap-linux") {
    const firefoxOptions = new seleniumFirefox.Options();
    firefoxOptions.setBinary("/snap/firefox/current/usr/lib/firefox/firefox");
    driver
      .forBrowser(WebDriver.Browser.FIREFOX)
      .setFirefoxOptions(firefoxOptions);
  }
  if (browser === "firefox-bin-win") {
    const firefoxOptions = new seleniumFirefox.Options();
    firefoxOptions.setBinary("C:/Program Files/Mozilla Firefox/firefox.exe");
    driver
      .forBrowser(WebDriver.Browser.FIREFOX)
      .setFirefoxOptions(firefoxOptions);
  }
  if (browser === "chrome-bin-linux") {
    const chromeOptions = new seleniumChrome.Options();
    chromeOptions.setBinary("/usr/bin/google-chrome");
    driver.forBrowser(WebDriver.Browser.CHROME).setChromeOptions(chromeOptions);
  }
  if (browser === "chrome-bin-win") {
    const chromeOptions = new seleniumChrome.Options();
    chromeOptions.setBinary(
      "C:/Program Files/Google/Chrome/Application/chrome.exe"
    );
    driver.forBrowser(WebDriver.Browser.CHROME).setChromeOptions(chromeOptions);
  }
  return driver.build();
}

module.exports = {
  messUserPass: mess_userpass,
  getPlatform: get_platform,
  getWebDriver: get_webdriver,
  getAvailableBrowser: get_available_browser,
};
