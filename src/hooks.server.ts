import { sequence } from "@sveltejs/kit/hooks";
import type { HandleServerError } from "@sveltejs/kit";
import { logHook } from "$lib/server/logger";

export const handle = sequence(logHook);

export const handleError: HandleServerError = async ({ error, event }) => {
	let message = "uh oh, you need to calm down... try again later";
	if (error instanceof Error) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (error.status === 404) {
			message = error.message;
		}
		event.locals.logger.error("Error", {
			error: {
				...error,
				stack: error?.stack
			}
		});
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
