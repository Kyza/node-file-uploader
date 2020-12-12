const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");

const defaults = {
	fs,
	http,
	corsProxy: "https://cors.isomorphic-git.org",
	dir: path.join(__dirname, ".."),
	singleBranch: true,
};

const update = async () => {
	const oldID = (await git.log(defaults))[0].oid;
	await git.fastForward(defaults);
	const newID = (await git.log(defaults))[0].oid;
	return oldID !== newID;
};

module.exports = { update };
