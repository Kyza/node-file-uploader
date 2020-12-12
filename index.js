#!/usr/bin/env node
(async () => {
	const fs = require("fs-extra");
	const path = require("path");
	const request = require("request");
	const clipboardy = require("clipboardy");
	const chokidar = require("chokidar");

	const Updater = require("./Updater");
	const Uploader = require("./Uploader");
	const Settings = require("./SettingsHandler");

	console.log("Starting uploader...");

	console.log("Checking for updates...");
	await Updater.update();

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
