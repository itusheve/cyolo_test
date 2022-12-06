const Redis = require("ioredis");

let redis;

// todo handle envs (test,dev,prod)
module.exports.DB = {
	connect() {
		redis = new Redis({
			host: "redis-10424.c250.eu-central-1-1.ec2.cloud.redislabs.com",
			port: 10424,
			password: "JJQbUFyZNZInIOw1J7kph82s8F1daR8X",
		});
	},
	async disconnect(done) {
		await redis.disconnect();
		done?.();
	},
	async get(key) {
		return await redis.get(key);
	},
	async set(key, value, key2, value2) {
		redis.set(key, value, key2, value2);
	},
};
