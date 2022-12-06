const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { DB } = require("./db");

const upload = multer({});
const app = express();
// API

const BASE_API = process.env.BASE_API ?? "";

app.get("/", (req, res) => {
	res.status(200).send("Hello World!");
});

// PUT /v1/file (enctype="multipart/form-data")
app.put("/v1/file", upload.single("image", {}), async (req, res) => {
	if (!req.file) return res.status(400).json({ message: "file required" });

	const imageTTL = req.headers["image-ttl"];

	const ONE_HOUR = 60 * 60;

	const ttl = imageTTL ? Number(imageTTL) * 60 : ONE_HOUR;

	const fileName = uuidv4();

	const fileAsBase64 = req.file.buffer.toString("base64");

	DB.set(fileName, `data:${req.file.mimetype};base64,${fileAsBase64}`, "EX", ttl);

	res.json({ src: BASE_API + "/v1/" + fileName });
});

// GET /v1/file-url
app.get("/v1/:filename", async (req, res) => {
	const filename = req.params.filename;
	const file = await DB.get(filename);
	if (!file) return res.status(400).json({ message: "file not found" });

	let data = file.split(";base64,");

	const type = data[0].substr(5); // get mimetype

	data = Buffer.from(data[1], "base64");

	res.writeHead(200, {
		"Content-Type": type,
		"Content-Length": data.length,
	});
	res.end(data);
});

module.exports = app;
