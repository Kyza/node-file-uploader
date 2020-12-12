const fs = require("fs-extra");
const path = require("path");
const request = require("request");
const clipboardy = require("clipboardy");

const Settings = require("../SettingsHandler");

const upload = (file) => {
	const settings = Settings.get();

	const formData = {
		...Object.assign(settings.form_options ?? {}, {
			[settings.form_file_name ?? "file"]: fs.createReadStream(path.join(file)),
		}),
	};

	console.log("Uploading Image:", file);

	request(
		{
			url: settings.url,
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			formData,
		},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				if (settings.link_path === "") {
					console.log(body);
					clipboardy.writeSync(body);
				} else {
					const linkPath = settings.link_path.split(".");
					// Only JSON supported for now.
					const current = JSON.parse(body);
					for (let i = 0; i < linkPath.length; i++) {
						current = current[linkPath[i]];
					}
					console.log(current);
					clipboardy.writeSync(current);
				}
			}
		}
	);
};

module.exports = {
	upload,
};
