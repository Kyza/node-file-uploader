const fs = require("fs-extra");
const path = require("path");
const request = require("request");
const { clipboard, Notification } = require("electron");

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

				clipboard.writeText(url);

				const notification = new Notification({
					title: "Node File Uploader",
					body: `Finished uploading.\n${file}`,
					icon: file,
					silent: true,
				});

				notification.show();
			} else {
				console.error(error);
				const notification = new Notification({
					title: "Node File Uploader",
					body: `There was an error uploading the file.\nClose notification to retry.\n${file}`,
					icon: file,
					silent: true,
				});

				notification.on("close", (event) => {
					upload(file);
				});

				notification.show();
			}
		}
	);
};

module.exports = {
	upload,
};
