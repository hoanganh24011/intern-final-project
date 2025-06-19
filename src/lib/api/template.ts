import { ApiResponse, Request } from "@type/api.type";
import { Templates, TemplatesQueryParams } from "@type/api/template.type";
import { apiGet, apiPost } from "@utils/config-api";


const DOMAIN = "https://eb4e-2405-4802-9407-89d0-9ece-9dcd-e668-f33a.ngrok-free.app/api";
const PATH = "/sns/templates";


/**
 * Api get templates
 * @param params TemplatesQueryParams
 * @returns ApiResponse<Templates[]>
 */
export const apiGetTemplates = async (params: TemplatesQueryParams) => {
	const request: Request = {
		params,
		token: "",
		url: `${DOMAIN}${PATH}`,
	};

	return await apiGet<ApiResponse<Templates[]>>(request);
};
/**
 * Api get templatebyid
 * @param id 
 * @returns  ApiResponse<Templates[]>
 */
export const apiGetTemplateById = async (id: string) => {
	return await apiGet<ApiResponse<Templates>>({
		params: { id },
		token: "",
		url: `${DOMAIN}${PATH}/${id}`,
	});
};
