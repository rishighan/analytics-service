"use strict";
const { analyticsQuery } = require("../utils/googleapi");

module.exports = {
	name: "analytics",

	
	settings: {

	},
	
	dependencies: [],
	actions: {
		fetch: {
			params: {
				query: { type: "string", optional: false },
			},
			async handler(ctx) {
				const data = await analyticsQuery(ctx.params.query);
				return data.data;
			},
		},
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};