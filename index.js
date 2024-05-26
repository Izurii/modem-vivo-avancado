const WebDriver = require("selenium-webdriver");
const seleniumFirefox = require("selenium-webdriver/firefox");

const firefoxOptions = new seleniumFirefox.Options();
firefoxOptions.setBinary("/snap/firefox/current/usr/lib/firefox/firefox");

const IP = "192.168.15.1";
const user = "admin";
const pass = "SENHA_AQUI";

function mess_userpass(str) {
  return str
    .split("")
    .map(function (c) {
      return String.fromCharCode(c.charCodeAt(0) ^ 0x1f);
    })
    .join("");
}
const userMessed = mess_userpass(user);
const passMessed = mess_userpass(pass);

async function getFreshSessionId() {
  const any = await fetch(`http://${IP}/login.asp`);
  const cookies = any.headers.getSetCookie();

  const cookiesObj = {};
  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookiesObj[key.trim()] = value;
  });

  const sessionId = cookiesObj["_httpdSessionId_"].split(";")[0];

  return sessionId;
}

async function doLogin() {
  const sessionId = await getFreshSessionId();

  const headers = new Headers();
  headers.append(
    "Cookie",
    `SessionID=${sessionId}; LoginRole=system; _httpdSessionId_=${sessionId}`
  );

  const urlencoded = new URLSearchParams();
  urlencoded.append("loginUsername", userMessed);
  urlencoded.append("loginPassword", passMessed);

  await fetch(`http://${IP}/cgi-bin/te_acceso_router.cgi`, {
    method: "POST",
    body: urlencoded,
    headers,
  });

  return sessionId;
}

(async function () {
  const sessionId = await doLogin();
  let driver = new WebDriver.Builder()
    .forBrowser(WebDriver.Browser.FIREFOX)
    .setFirefoxOptions(firefoxOptions)
    .build();

  await driver.get(`http://${IP}/login.asp`);
  await driver.manage().addCookie({ name: "SessionID", value: sessionId });
  await driver.manage().addCookie({ name: "LoginRole", value: "system" });
  await driver
    .manage()
    .addCookie({ name: "_httpdSessionId_", value: sessionId, httpOnly: true });

  driver.navigate().to(`http://${IP}/avanzada.asp`);
})();
