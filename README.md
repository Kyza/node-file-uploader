# Node Image Uploader

## What is this?

A simple program that automatically uploads all _new_ files in a folder to a file hoster of your choice.

## Installation

### Requirements

- [NodeJS](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Step 1

```bash
git clone https://github.com/KyzaGitHub/node-file-uploader
cd node-file-uploader
npm i
npm i -g .
```

The `node-file-uploader` command is now available globally.

### Step 2

Copy this example into a file called `settings.json` and adjust as needed.

```json
{
	"folders": ["C:/Users/Kyza/Pictures/Snipaste"], // Handles subfolders!
	"url": "https://api.pxl.blue/upload/sharex",
	"file_form_name": "file",
	"form_options": {
		"key": "",
		"host": "pxl_rand"
	},
	"link_path": "",
	"automatic_updating": true
}
```

### Step 3

You can now simply run `node-file-uploader` anywhere to start the program.

You can also create a command line file to run on startup.

#### Windows

```batch
@echo off
node-file-uploader
```

Save the file as `whatever-you-want.cmd` and place it in `C:\Users\[User Name]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`.

#### macOS

You're on your own to figure out how to do this.

#### Linux

You should already know how to do this anyway.

# Update Test
