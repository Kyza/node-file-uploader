#!/usr/bin/env node
const { app, Menu, Tray, Notification } = require("electron");

console.log("Starting.");

const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");
const cp = require("child_process");

if (!app) {
	console.log("Starting as electron app.");
	const electronProcess = cp.execFile(
		path.join(__dirname, "node_modules", "electron", "dist", "electron.exe"),
		[__dirname],
		{ encoding: "buffer" },
		(error, stdout, stderr) => {
			if (error) {
				throw error;
			}
			console.log(stdout);
			console.error(stderr);
		}
	);
	electronProcess.stdout.on("data", (data) => {
		console.log(`${data}`.trim());
	});
	electronProcess.stderr.on("data", (data) => {
		console.error(`${data}`.trim());
	});
	return;
}

let tray;

app.whenReady().then(async () => {
	try {
		app.setAppUserModelId("Node File Uploader");

		tray = new Tray("C:/Users/Kyza/Pictures/Snipaste/2020-12-12_18-00-28.png");
		const contextMenu = Menu.buildFromTemplate([
			{ label: "Item1", type: "radio" },
			{ label: "Item2", type: "radio" },
		]);

		// Make a change to the context menu
		contextMenu.items[1].checked = false;

		// Call this again for Linux because we modified the context menu
		tray.setContextMenu(contextMenu);

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
				cp.fork(path.join(__dirname, "index.js"), process.argv, {
					detatched: true,
				});
				return;
			}
			console.log("No new version.");
		} catch (e) {
			console.error(
				`Error checking for updates.\n${e.toString()}\n${__dirname}`
			);
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
	} catch (e) {
		console.error(
			"Something broke. Reread the README.md, maybe a setting name changed.\n\nBut here's the error just in case:"
		);
		console.error(e);
	}
});

app.once("will-quit", () => {
	tray = null;
});
