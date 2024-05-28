const Utils = require("./utils");

const IP = "192.168.15.1";
const user = "admin";
const pass = "SENHA_AQUI";

module.exports = {
  IP,
  user: Utils.messUserPass(user),
  pass: Utils.messUserPass(pass),
};
