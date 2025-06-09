import { ApiResponse } from "@type/api.type";
import { TemplateQueryParams } from "@type/api/template.type";
import { apiGet } from "@utils/config-api";

const SUB_PATH = "/sns/templates";

/**
 * Api get templates
 * @param params BrandQueryParams
 * @returns ApiResponse<Template[]>
 */
export const apiGetTemplates = async (params: TemplateQueryParams) => {
    return await apiGet<ApiResponse<TemplateQueryParams[]>>({
        params,
        token: "",
        url: SUB_PATH,
    });
};
