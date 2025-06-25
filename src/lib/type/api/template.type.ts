import { AuditInfo, Param } from "@type/common.type";

export type Templates = {
	id?: string;
	name?: string;
	brand_id?: string;
	content: string;
	params: string[];
} & Param;

export type TemplatesQueryParams = {
	name?: string;
	content?: string;
	params?: string[];
	brand_id?: string;
};
 export type Template = TemplatesQueryParams & AuditInfo;