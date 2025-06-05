import { Param } from "@type/common.type";

export type PitelF = {
	api_auth_url: string;
	api_oa_url: string;
	api_url: string;
	app_id_oa: string;
	client_id: string;
	client_secret: string;
	grant_type: string;
	scope: string;
	secret_key_oa: string;
	signature: string;
};

export type PitelI = {
	api_oa_url: string;
	api_url: string;
	password: string;
	signature: string;
	username: string;
};

export type TemplateSetting = {
	pitel_f: PitelF;
	pitel_i: PitelI;
};

export type TemplateWebhookURL = {
	method_action: string;
	password: string;
	signature: string;
	token: string;
	url: string;
	username: string;
};

export type TemplatePlugin = {
	brand_name: string;
	created_at: Date;
	created_by: string;
	domain_uuid: string;
	max_attempts: number;
	plugin_alias: string;
	plugin_name: string;
	plugin_uuid: string;
	setting: TemplateSetting;
	status: boolean;
	updated_at: Date;
	updated_by: string;
	webhook_url: TemplateWebhookURL[];
};

export type Template = {
	approve_status: string;
	approved_at: Date;
	content: string;
	created_at: Date;
	domain_uuid: string;
	note: string;
	partition: string;
	plugin: TemplatePlugin;
	plugin_uuid: string;
	sample_content: string;
	status: boolean;
	template_code: string;
	template_name: string;
	template_type: string;
	template_uuid: string;
	updated_at: Date;
	params: string[];
};

export type TemplateQueryParam = Param & {
	sort_by?: string;
	brandname_uuid?: string;
	domain_uuid?: string;
	keyword?: string;
	template_uuid?: string;
	template_name?: string;
	template_code?: string;
	template_type?: string;
	plugin_uuid?: string;
	status?: boolean;
};

export type TemplateSyncResponse = {
	total_failed: number;
	total_success: number;
};

export type TemplatePostBody = {
	approve_status?: string;
	brandname_uuid: string;
	content: string;
	note?: string;
	sample_content?: string;
	status: boolean;
	template_code: string;
	template_name: string;
	template_type: string;
};

export type TemplatePutBody = {
	content: string;
	note?: string;
	sample_content?: string;
	status: boolean;
	template_code: string;
	template_name: string;
	template_type: string;
};

export type TemplatePatchBody = {
	content?: string;
	note?: string;
	sample_content?: string;
	status?: boolean;
	template_code?: string;
	template_name?: string;
};
