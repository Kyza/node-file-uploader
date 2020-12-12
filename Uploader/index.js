const fs = require("fs-extra");
const path = require("path");
const request = require("request");
const clipboardy = require("clipboardy");
const notifier = require("node-notifier");

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
				let result;
				if (settings.link_path === "") {
					result = body;
				} else {
					const linkPath = settings.link_path.split(".");
					// Only JSON supported for now.
					const current = JSON.parse(body);
					for (let i = 0; i < linkPath.length; i++) {
						current = current[linkPath[i]];
					}
					result = current;
				}
				console.log(result);
				notifier.notify({
					appID: "Node File Uploader",
					title: "Node File Uploader",
					subtitle: undefined,
					message: result,
					sound: false,
					icon: file,
					contentImage: file,
					open: undefined,
					timeout: 5,
					closeLabel: undefined,
					actions: undefined,
					dropdownLabel: undefined,
					reply: false,
				});
				clipboardy.writeSync(result);
			} else {
				notifier.notify({
					appID: "Node File Uploader",
					title: "Node File Uploader",
					subtitle: undefined,
					message: `There was an error uploading the file.\n${file}`,
					sound: false,
					icon: file,
					contentImage: file,
					open: undefined,
					timeout: 5,
					closeLabel: undefined,
					actions: undefined,
					dropdownLabel: undefined,
					reply: false,
				});
			}
		}
	);
};

module.exports = {
	upload,
};
