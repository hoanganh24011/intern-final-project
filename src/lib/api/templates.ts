import { apiGet } from "@utils/config-api";
import { ApiResponse, Request } from "@type/api.type";
import { Template, TemplatesQueryParams } from "@type/api/template.type";

const DOMAIN = "https://eb4e-2405-4802-9407-89d0-9ece-9dcd-e668-f33a.ngrok-free.app/api";
const PATH = "/sns/templates";

export const apiGetTemplates = async (params: TemplatesQueryParams) => {
	const request: Request = {
		url: `${DOMAIN}${PATH}`,
		token: "",
		params,
	};
	return await apiGet<ApiResponse<Template[]>>(request);
};
