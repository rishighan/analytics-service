// redis connection config
let redis = require("redis");
let client = redis.createClient(process.env.REDIS_URL);

module.exports = {
	connect: function () {
		client.on("connect", () => {
			console.log("Redis URL:", process.env.REDIS_URL);
		});
	},
	client: client
};