import { apiGet } from "@utils/config-api";
import { ApiResponse, Request } from "@type/api.type";
import { Template, TemplateQueryParams } from "@type/api/template.type";

export const apiGetTemplates = async (params: TemplateQueryParams) => {
	const request: Request = {
		url: "/templates",
		token: "",
		params,
	};
	return await apiGet<ApiResponse<Template[]>>(request);
};
