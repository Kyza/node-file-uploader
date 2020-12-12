#!/usr/bin/env node
(async () => {
	const fs = require("fs-extra");
	const path = require("path");
	const chokidar = require("chokidar");
	const cp = require("child_process");

	const Updater = require("./Updater");
	const Uploader = require("./Uploader");
	const Settings = require("./SettingsHandler");

	console.log("Starting uploader...");

	if (!fs.existsSync(Settings.path)) {
		console.log("No settings.json. Read the instructions.");
		return;
	}

	console.log("Checking for updates...");
	try {
		if (Settings.get().automatic_updating && (await Updater.update())) {
			console.log("Updated.\nRestarting...");
			cp.fork(path.join(process.cwd(), "index.js"), process.argv, {
				detatched: true,
			});
			return;
		}
		console.log("No new version.");
	} catch (e) {
		console.error(`Error checking for updates.\n${e.toString()}\n${__dirname}`);
	}

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
