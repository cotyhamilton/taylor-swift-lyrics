import { sequence } from "@sveltejs/kit/hooks";
import type { HandleServerError } from "@sveltejs/kit";
import { logHook } from "$lib/server/logger";

export const handle = sequence(logHook);

export const handleError: HandleServerError = async ({ error, event }) => {
	if (error instanceof Error) {
		event.locals.logger.error("Error", {
			error: {
				...error,
				stack: error?.stack
			},
			trace: event.locals.trace
		});
	} else {
		event.locals.logger.error("Error", {
			error,
			trace: event.locals.trace
		});
	}

	return {
		message: "Oops ... an error occurred",
		id: event.locals.trace
	};
};
