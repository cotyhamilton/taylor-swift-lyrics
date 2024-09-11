import type { Handle } from "@sveltejs/kit";
import * as log from "@std/log";
import { dev } from "$app/environment";

// Set up logging configuration
log.setup({
	handlers: {
		// Production handler
		default: new log.ConsoleHandler("INFO", {
			formatter: log.formatters.jsonFormatter,
			useColors: false
		}),
		// Development handler
		dev: new log.ConsoleHandler("DEBUG", {
			formatter: (record) => `
${record.levelName} [${record.msg}] ${record.datetime.toISOString()}
${record.args.map((arg) => JSON.stringify(arg, null, 2)).join("\n")}`,
			useColors: true
		})
	},
	loggers: {
		// Use dev handler in development, default in production
		default: {
			handlers: [dev ? "dev" : "default"]
		}
	}
});

// Handle function for logging HTTP requests.
export const logHook: Handle = async ({ event, resolve }) => {
	// Record the start time of the request
	const requestStartTime = Date.now();
	// Generate a unique trace ID for the request
	const trace = crypto.randomUUID();
	event.locals.trace = trace;

	// Get the logger instance
	const logger = log.getLogger();
	// Save the logger instance to locals
	event.locals.logger = logger;

	// Request details
	const url = event.url.toString();
	const userAgent = event.request.headers.get("user-agent") || "Unknown";

	// Log the start of the HTTP request
	logger.info("HTTP Request Started", {
		method: event.request.method,
		url,
		["user-agent"]: userAgent,
		trace
	});

	// Wait for the request to be processed
	const response = await resolve(event);

	// Log the completion of the HTTP request
	logger.info("HTTP Request Finished", {
		method: event.request.method,
		url,
		["user-agent"]: userAgent,
		duration: `${Date.now() - requestStartTime}ms`,
		status: response.status,
		trace
	});

	return response;
};
