import { Param } from "@type/common.type";

export type TemplateType = "sns" | "crm";
export type TemplateSource = "sms" | "zns";
export type LeadStatus = "new" | "queue" | "processing" | "done" | "cancel" | "fail";
export type Lead = {
	additional_info: null;
	address: string;
	created_at: Date;
	created_by: string;
	domain_uuid: string;
	email: string;
	fullname: string;
	lead_uuid: string;
	list_uuid: string;
	network: string;
	number_retry: number;
	phone_number: string;
	status: string;
	updated_at: Date;
	updated_by: string;
	relation_info: Record<string, string>;
};

export type LeadQueryParam = {
	campaign_uuid?: string;
	list_uuid?: string;
	template_uuid?: string;
	template_type?: TemplateType;
	sources?: TemplateSource;
	phone_number?: string;
	statuses?: LeadStatus[];
	created_at_gte?: string;
	created_at_lte?: string;
} & Param;

export type LeadDataBody = {
	additional_info: Record<string, unknown>;
	address: string;
	email: string;
	fullname: string;
	phone_number: string;
};

export type LeadPostBody = {
	duplicate_data_type?: DuplicateDataType;
	duplicate_scope?: DuplicateScope;
	exclude_duplicate?: boolean;
	leads: LeadDataBody[];
	list_uuid: string;
};

export type DuplicateDataType = "phone_number" | "all";
export type DuplicateScope = "list" | "campaign" | "all";

export type LeadUploadPostBody = {
	duplicate_data_type?: DuplicateDataType;
	duplicate_scope?: DuplicateScope;
	exclude_duplicate?: boolean;
	file: File;
	list_uuid: string;
};

export type UploadResponse = { id: string; invalid_items: number; total_items: number };
