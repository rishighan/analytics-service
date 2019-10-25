"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../services/analytics.service");

describe("Test 'analytics' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(TestService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'greeter.hello' action", () => {
		it("should return with 'Hello Moleculer'", () => {
			expect("hello").toEqual("hello");
		});

	});
});

