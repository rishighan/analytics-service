const { google }  = require("googleapis");
const _ = require("lodash");
const dotenv = require("dotenv");
const gAPICredentials = dotenv.config();

const privateKey = _.replace(gAPICredentials.parsed.PRIVATE_KEY, /\\n/g, '\n');

const jwtClient = new google.auth.JWT(gAPICredentials.parsed.CLIENT_EMAIL,
	null,
	privateKey,
	"https://www.googleapis.com/auth/analytics.readonly");

const analyticsQuery = async (queryString)  => {
	const parsedQueryJSON = JSON.parse(queryString);
	const authResponse = await jwtClient.authorize();
	const queryConfig = _.extend({"auth": jwtClient}, parsedQueryJSON);
	const analyticsData = await google.analytics("v3").data.ga.get(queryConfig);
	return analyticsData;
};

module.exports = {
	jwtClient,
	analyticsQuery
};