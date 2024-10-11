import { sequence } from "@sveltejs/kit/hooks";
import type { HandleServerError } from "@sveltejs/kit";
import { logHook } from "$lib/server/logger";

export const handle = sequence(logHook);

interface HttpError extends Error {
	status: number;
}

export function isHttpError(e: unknown): e is HttpError {
	return e instanceof Error && "status" in e;
}

export const handleError: HandleServerError = async ({ error, event }) => {
	let message = "uh oh, you need to calm down... try again later";

	if (isHttpError(error)) {
		if (error.status === 404) {
			message = error.message;
		} else {
			event.locals.logger.error("Error", {
				error,
				stack: error.stack
			});
		}
	} else {
		event.locals.logger.error("Error", {
			error,
			stack: error instanceof Error ? error.stack : undefined
		});
	}

	return {
		trace: event.locals.trace,
		message
	};
};
