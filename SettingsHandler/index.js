const path = require("path");

const get = (setting = "") => {
	return require(path.join(process.cwd(), "settings.json"));
};

module.exports = {
	get,
};
