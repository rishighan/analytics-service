const { google } = require("googleapis");
const _ = require("lodash");
const zookeeper = require("node-zookeeper-client");

const client = zookeeper.createClient(process.env.ZOOKEEPER_HOST);
let analyticsQuery;
let jwtClient;

const getNodeData = (path, client) => {
	return new Promise((resolve, reject) => {
		client.getData(
			path,
			(event) => {
				console.log("Got event: %s.", event);
			},
			(error, data, stat) => {
				if (error) {
					console.log(error.stack);
					reject(error);
				}
				resolve(data.toString("utf8"));
				// console.log('Got data: %s', data.toString('utf8'));
			}
		);
	});
};

const getCredentials = () => {
	const client_email = getNodeData("/googleapi/client_email", client);
	const private_key = getNodeData("/googleapi/private_key", client);
	return Promise.all([client_email, private_key])
		.then((data, error) => {
			if (error) {
				console.log(error);
			}
			const privateKey = _.replace(data[1], /\\n/g, "\n");
			return new google.auth.JWT(
				data[0],
				null,
				privateKey,
				"https://www.googleapis.com/auth/analytics.readonly"
			);
		});
};

client.once("connected", () => {
	console.log("Connected to the Zookeeper server.");
});

client.connect();
analyticsQuery = async queryString => {
	jwtClient = await getCredentials();
	const parsedQueryJSON = JSON.parse(queryString);
	const authResponse = await jwtClient.authorize();
	const queryConfig = _.extend({ auth: jwtClient }, parsedQueryJSON);
	const analyticsData = await google.analytics("v3").data.ga.get(queryConfig);
	return analyticsData;
};


module.exports = {
	jwtClient,
	analyticsQuery
};
