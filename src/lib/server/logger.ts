import { env } from "$env/dynamic/private";
import type { Handle } from "@sveltejs/kit";
import { pino } from "pino";

// Handle function for logging HTTP requests.
export const logHook: Handle = async ({ event, resolve }) => {
	// Record the start time of the request
	const requestStartTime = Date.now();
	// Generate a unique trace ID for the request
	const trace = crypto.randomUUID();
	event.locals.trace = trace;

	// Create logger instance
	const logger = pino({
		level: env.LOG_LEVEL || "info"
	}).child({ trace });
	// Save the logger instance to locals
	event.locals.logger = logger;

	// Request details
	const url = event.url.toString();
	const userAgent = event.request.headers.get("user-agent") || "Unknown";

	// Log the start of the HTTP request
	logger.info(
		{
			method: event.request.method,
			url,
			["user-agent"]: userAgent
		},
		"HTTP Request Started"
	);

	// Wait for the request to be processed
	const response = await resolve(event);

	// Log the completion of the HTTP request
	logger.info(
		{
			method: event.request.method,
			url,
			["user-agent"]: userAgent,
			duration: `${Date.now() - requestStartTime}ms`,
			status: response.status
		},
		"HTTP Request Finished"
	);

	return response;
};
