import { ApiResponse } from "@type/api.type";
import { BrandQueryParams } from "@type/api/brand.type";
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
/**
 * Api get brand by id
 * @param id string
 */
export type Brand = {
	id: string;
	name: string;
	description: string;
	channel: string;
	created_at?: string;
	updated_at?: string;
};

export type BrandResponse = {
	code: string;
	message: string;
	total?: number;
	data: Brand[];
};

/**
 * method api
 */
export const brandApiHeaders = {
	"Content-Type": "application/json",
	"ngrok-skip-browser-warning": "true",
};
