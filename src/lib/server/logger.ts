import { env } from "$env/dynamic/private";
import type { Handle } from "@sveltejs/kit";
import { pino } from "pino";

export const logger = pino({
	level: env.LOG_LEVEL || "info",
	serializers: {
		error: pino.stdSerializers.err
	}
});

// Handle function for logging HTTP requests.
export const logHook: Handle = async ({ event, resolve }) => {
	// Record the start time of the request
	const requestStartTime = Date.now();
	// Generate a unique trace ID for the request
	const trace = crypto.randomUUID();
	event.locals.trace = trace;

	// Save child logger instance to locals
	event.locals.logger = logger.child({ trace });

	const url = event.url.toString();

	// Log the start of the HTTP request
	event.locals.logger.debug(
		{
			method: event.request.method,
			url
		},
		"HTTP Request Started"
	);

	// Wait for the request to be processed
	const response = await resolve(event);

	// Log the completion of the HTTP request
	event.locals.logger.info(
		{
			method: event.request.method,
			url,
			duration: `${Date.now() - requestStartTime}ms`,
			status: response.status
		},
		"HTTP Request Finished"
	);

	return response;
};
