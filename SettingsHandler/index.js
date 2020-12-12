const path = require("path");

const settingsPath = path.join(__dirname, "..", "settings.json");

const get = (setting = "") => {
	return require(settingsPath);
};

module.exports = {
	get,
	path: settingsPath,
};
