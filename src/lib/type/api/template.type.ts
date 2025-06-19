import { AuditInfo, Param } from "@type/common.type";

export type Template = {
	id: string;
	name: string;
	content: string;
	createdAt?: string;
	brandId?: string;
	brandName?: string;
	params: string[];
} & AuditInfo;

export type TemplateQueryParams = {
	name?: string;
	created_at?: string;
} & Param;
