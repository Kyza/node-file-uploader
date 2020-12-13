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
				let url;
				let deletionURL;

				if (settings.url_path !== "") {
					const urlPath = settings.url_path.split(".");
					// Only JSON supported for now.
					let current = JSON.parse(body);
					for (let i = 0; i < urlPath.length; i++) {
						current = current[urlPath[i]];
					}
					url = current;
				} else {
					url = body;
				}
				if (settings.deletion_url_path !== "") {
					const deletionURLPath = settings.deletion_url_path.split(".");
					// Only JSON supported for now.
					let current = JSON.parse(body);
					for (let i = 0; i < deletionURLPath.length; i++) {
						current = current[deletionURLPath[i]];
					}
					deletionURL = current;
				}

				notifier.notify({
					appID: "Node File Uploader",
					title: "Node File Uploader",
					subtitle: undefined,
					message: `${url}\n${deletionURL}`,
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
				clipboardy.writeSync(url);
			} else {
				console.error(error);
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
