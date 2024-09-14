import { sequence } from "@sveltejs/kit/hooks";
import type { HandleServerError } from "@sveltejs/kit";
import { logHook } from "$lib/server/logger";

export const handle = sequence(logHook);

export function isHttpError(e: unknown) {
	return e instanceof Error && "status" in e;
}

export const handleError: HandleServerError = async ({ error, event }) => {
	let message = "uh oh, you need to calm down... try again later";

	if (isHttpError(error) && error.status === 404) {
		message = error.message;
	} else {
		event.locals.logger.error("Error", {
			error
		});
	}

	return {
		trace: event.locals.trace,
		message
	};
};
