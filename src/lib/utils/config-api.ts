import { ApiMethod, Request } from "@type/api.type";

/**
 * @param method
 * @param request
 * @returns Promise<ApiResponse<T>>
 */
export async function apiRequest<T>(method: ApiMethod, request: Request): Promise<T> {
	const { url, token, body, params } = request;

	const query = params
		? "?" + new URLSearchParams(params as Record<string, string>).toString()
		: "";

	const response = await fetch(`${url}${query}`, {
		method,
		headers: {
			"Content-Type": "application/json",
			"ngrok-skip-browser-warning": "true",
			Authorization: `Bearer ${token}`,
		},

		body: ["GET", "DELETE"].includes(method) ? undefined : body,
	});

	const data = await response.json();

	return data as T;
}

export const apiGet = <T>(request: Request) => apiRequest<T>("GET", request);

export const apiPost = <T>(request: Request) => apiRequest<T>("POST", request);

export const apiPut = <T>(request: Request) => apiRequest<T>("PUT", request);

export const apiPatch = <T>(request: Request) => apiRequest<T>("PATCH", request);

export const apiDelete = <T>(request: Request) => apiRequest<T>("DELETE", request);
