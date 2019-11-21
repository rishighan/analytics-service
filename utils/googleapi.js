const { google } = require("googleapis");
const _ = require("lodash");
const redis = require("../config/redis.config");
const zookeeper = require("node-zookeeper-client");

const client = zookeeper.createClient(process.env.ZOOKEEPER_HOST);
const path = process.argv[2];

listChildren = (client, path) => {
  client.getChildren(
    path,
    event => {
      console.log("Got watcher event: %s", event);
      listChildren(client, path);
    },
    (error, children, stat) => {
      if (error) {
        console.log("Failed to list children of %s due to: %s.", path, error);
        return;
      }

      console.log("Children of %s are: %j.", path, children);
    }
  );
};

client.once("connected", function() {
  console.log("Connected to ZooKeeper.");
  listChildren(client, path);
});

client.connect();

let jwtClient;
redis.client.hgetall("googleapi", (error, data) => {
  const privateKey = _.replace(data.private_key, /\\n/g, "\n");
  jwtClient = new google.auth.JWT(
    data.client_email,
    null,
    privateKey,
    "https://www.googleapis.com/auth/analytics.readonly"
  );
});

const analyticsQuery = async queryString => {
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
