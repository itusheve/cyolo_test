require("dotenv").config();
const app = require("./app");
const { DB } = require("./db");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log("SERVER RUN ON PORT", PORT);
	DB.connect();
});
