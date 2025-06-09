import { ApiResponse } from "@type/api.type";
import { Brand, BrandQueryParams } from "@type/api/brand.type";
import { apiGet } from "@utils/config-api";

const SUB_PATH = "/sns/brands";

/**
 * Api get brands
 * @param params BrandQueryParams
 * @returns ApiResponse<Brand[]>
 */
export const apiGetBrands = async (params: BrandQueryParams) => {
	return await apiGet<ApiResponse<Brand[]>>({
		params,
		token: "",
		url: SUB_PATH,
	});
};
