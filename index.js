const Vars = require("./vars");
const Utils = require("./utils");

async function getFreshSessionId() {
	const any = await fetch(`http://${Vars.IP}/login.asp`);
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
	urlencoded.append("loginUsername", Vars.user);
	urlencoded.append("loginPassword", Vars.pass);

	await fetch(`http://${Vars.IP}/cgi-bin/te_acceso_router.cgi`, {
		method: "POST",
		body: urlencoded,
		headers,
	});

	return sessionId;
}

(async function () {
	const platform = Utils.getPlatform();
	if (platform !== "win32" && platform !== "linux" && platform != "darwin") {
		console.error("Plataforma não suportada. Esse script suporta apenas Linux, Windows e MacOS");
		process.exit(1);
	}

	const sessionId = await doLogin();

	const driver = Utils.getWebDriver(platform);
	await driver.manage().window().maximize();

	await driver.get(`http://${Vars.IP}/login.asp`);
	await driver.manage().addCookie({ name: "SessionID", value: sessionId });
	await driver.manage().addCookie({ name: "LoginRole", value: "system" });
	await driver.manage().addCookie({ name: "_httpdSessionId_", value: sessionId, httpOnly: true });

	await driver.navigate().to(`http://${Vars.IP}/avanzada.asp`);
})();
