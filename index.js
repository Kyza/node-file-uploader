#!/usr/bin/env node
(async () => {
	const fs = require("fs-extra");
	const path = require("path");
	const chokidar = require("chokidar");

	const Updater = require("./Updater");
	const Uploader = require("./Uploader");
	const Settings = require("./SettingsHandler");

	console.log("Starting uploader...");

	if (!fs.existsSync(path.join(process.cwd(), "settings.json"))) {
		console.log("No settings.json. Read the instructions.");
		process.exit();
	}

	console.log("Checking for updates...");
	if (Settings.get().automatic_updating && (await Updater.update())) {
		console.log("Updated.\nRestarting...");
		process.fork(path.join(process.cwd(), "index.js"), process.argv, {
			detatched: true,
		});
		process.exit();
	}
	console.log("No new version.");

	const settings = Settings.get();
	for (const folder of settings.folders) {
		const watcher = chokidar.watch(folder, {
			ignored: /^\./,
			persistent: true,
			awaitWriteFinish: true,
			ignoreInitial: true,
		});

		watcher
			.on("add", function (path) {
				Uploader.upload(path);
			})
			.on("error", function (error) {
				console.error(error);
			});
	}

	console.log("Started.");
})();
