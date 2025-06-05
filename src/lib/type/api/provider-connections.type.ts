import { AuditInfo, Param } from "@type/common.type";

export type Type = "brand_name" | "oa";

export type ProviderConnectionQueryParam = {
	name?: string;
	types?: Type[];
	sort_by?: "asc" | "desc";
	created_at_gte?: string;
	created_at_lte?: string;
} & Param;

export type ProviderConnection = {
	id: string;
	domain_id: string;
	bu_id: string;
	supplier_id: string;
	name: string;
	channels: string[];
	description: string;
	active: boolean;
	additional_info: Record<string, string>;
	webhook_authorize_token: string;
	webhook_url: string;
	deleted_at: string;
} & AuditInfo;

export type ProviderConnectionBody = {
	active: boolean;
	additional_info?: Record<string, string>;
	channels?: string[];
	description?: string;
	name: string;
	supplier_id: string;
	webhook_authorize_token: string;
	webhook_url: string;
};
