import { Param } from "@type/common.type";

export type List = {
	active: boolean;
	campaign_uuid: string;
	created_at: Date;
	domain_uuid: string;
	list_name: string;
	list_uuid: string;
	total_fail: number;
	total_success: number;
	updated_at: Date;
};

export type ListQueryParam = {
	campaign_uuid?: string;
	list_name?: string;
	active?: boolean;
} & Param;

export type ListPostBody = {
	active?: boolean;
	campaign_uuid: string;
	list_name: string;
};

export type ListPatchBody = {
	list_name: string;
};

export type ListResponseData = {
	active: boolean;
	campaign_uuid: string;
	created_at: Date;
	domain_uuid: string;
	list_name: string;
	list_uuid: string;
	total_fail: number;
	total_success: number;
	updated_at: Date;
};

export type ListExportQueryParam = {
	lang: "vi" | "vn";
	file_type: "xlsx" | "csv";
};

export type ListExportResponse = {
	export_name: string;
	status: string;
};
