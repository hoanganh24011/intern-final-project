import { ApiResponse, Request } from "@type/api.type";
import { Brand, BrandQueryParams } from "@type/api/brand.type";
import { apiGet } from "@utils/config-api";

const DOMAIN = "https://eb4e-2405-4802-9407-89d0-9ece-9dcd-e668-f33a.ngrok-free.app/api";
const PATH = "/sns/brands";

/**
 * Api get brands
 * @param params BrandQueryParams
 * @returns ApiResponse<Brand[]>
 */
export const apiGetBrands = async (params: BrandQueryParams) => {
	const request: Request = {
		params,
		token: "",
		url: `${DOMAIN}${PATH}`,
	};

	return await apiGet<ApiResponse<Brand[]>>(request);
};
