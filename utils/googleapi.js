const { google } = require("googleapis");
const _ = require("lodash");
const redis = require("../config/redis.config");
const ZooKeeper = require("zookeeper").Promise;

function createClient(timeoutMs = 5000) {
	const config = {
		connect: process.env.ZOOKEEPER_HOST,
		timeout: timeoutMs,
		debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
		host_order_deterministic: false,
	};

	return new ZooKeeper(config);
}

const client = createClient();
console.log("ZOOKEEPER HOST-> ", client);

let jwtClient;
redis.client.hgetall("googleapi", (error, data) => {
	const privateKey = _.replace(data.private_key, /\\n/g, "\n");	
	jwtClient = new google.auth.JWT(data.client_email,
		null,
		privateKey,
		"https://www.googleapis.com/auth/analytics.readonly");
});

const analyticsQuery = async (queryString) => {
	const parsedQueryJSON = JSON.parse(queryString);
	const authResponse = await jwtClient.authorize();
	const queryConfig = _.extend({ "auth": jwtClient }, parsedQueryJSON);
	const analyticsData = await google.analytics("v3").data.ga.get(queryConfig);
	return analyticsData;
};

module.exports = {
	jwtClient,
	analyticsQuery
};