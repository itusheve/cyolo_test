const request = require("supertest");
const app = require("../app");
const { DB } = require("../db");
const path = require("path");
const imagePath = path.resolve(__dirname, "./me2.jpg");

describe("Test the root path", () => {
	beforeAll(() => {
		DB.connect();
	});

	test("It should create validd url for file", (done) => {
		request(app)
			.put("/v1/file")
			.attach("image", imagePath)
			.then((response) => {
				expect(response.statusCode).toBe(200); //file create
				request(app)
					.get(response.body.src)
					.then((res) => {
						expect(res.statusCode).toBe(200); //succes read file
						done();
					});
			})
			.catch((err) => {
				console.log(err.message);
				done(err);
			});
	});

	afterAll((done) => {
		DB.disconnect(done);
	});
});
