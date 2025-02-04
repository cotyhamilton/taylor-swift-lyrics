import type { Handle } from "@sveltejs/kit";
import * as log from "@std/log";
import { dev } from "$app/environment";

// Creates a child logger from a parent logger with optional persistent data
export function childLogger(
	logger: log.Logger,
	data: Record<string, unknown> = {}
): log.Logger & { data: Record<string, unknown> } {
	return {
		...logger,
		level: logger.level,
		levelName: logger.levelName,
		loggerName: logger.loggerName,
		data,
		debug: (msg: () => unknown, args: Record<string, unknown> = {}) => {
			logger.debug(msg, { ...data, ...args });
		},
		info: (msg: () => unknown, args: Record<string, unknown> = {}) => {
			logger.info(msg, { ...data, ...args });
		},
		warn: (msg: () => unknown, args: Record<string, unknown> = {}) => {
			logger.warn(msg, { ...data, ...args });
		},
		error: (msg: () => unknown, args: Record<string, unknown> = {}) => {
			logger.error(msg, { ...data, ...args });
		},
		critical: (msg: () => unknown, args: Record<string, unknown> = {}) => {
			logger.critical(msg, { ...data, ...args });
		}
	};
}

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

	// Create logger instance
	const logger = childLogger(log.getLogger(), { trace });
	// Save the logger instance to locals
	event.locals.logger = logger;

	// Request details
	const url = event.url.toString();
	const userAgent = event.request.headers.get("user-agent") || "Unknown";

	// Log the start of the HTTP request
	logger.info("HTTP Request Started", {
		method: event.request.method,
		url,
		["user-agent"]: userAgent
	});

	// Wait for the request to be processed
	const response = await resolve(event);

	// Log the completion of the HTTP request
	logger.info("HTTP Request Finished", {
		method: event.request.method,
		url,
		["user-agent"]: userAgent,
		duration: `${Date.now() - requestStartTime}ms`,
		status: response.status
	});

	return response;
};
