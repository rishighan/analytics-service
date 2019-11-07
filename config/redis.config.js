// redis connection config
let redis = require("redis");
const REDIS_PORT = process.env.REDIS_PORT ? process.env.REDIS_PORT : "6379";
const REDIS_HOST = process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost";
let client = redis.createClient(REDIS_PORT, REDIS_HOST);

module.exports = {
	connect: function () {
		client.on("connect", () => {
			console.log("Redis server found on", REDIS_HOST);
		});
	},
	client: client
};