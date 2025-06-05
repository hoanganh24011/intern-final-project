import { AuditInfo, Param } from "@type/common.type";
import { OA } from "./oa.type";
import { Template } from "./template.type";

export type CampaignStatus = "running" | "paused" | "stopped";
export type CampaignType = "now" | "schedule";
export type CampaignChanel = "sms" | "zns";
export type CampaignTypeSend = "now" | "schedule";

export type CampaignList = {
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

export type CampaignRunList = {
	campaign_uuid: string;
	created_at: Date;
	domain_uuid: string;
	id: string;
	list_uuid: string;
	param: null;
	run_uuid: string;
	updated_at: Date;
};
export type CampaignStats = {
	total_leads: number;
	total_success_leads: number;
	total_failed_leads: number;
	percent_done_leads: number;
};

export type Campaign = {
	active: boolean;
	campaign_name: string;
	campaign_uuid: string;
	domain_uuid: string;
	is_user_pause: boolean;
	lists: CampaignList[];
	number_concurrency: number;
	run_lists: CampaignRunList[];
	status: string;
	template: Template;
	template_uuid: string;
	time_end: Date;
	time_end_running: string;
	time_start: string;
	time_start_running: string;
	type: string;
	oa: OA;
	stats: CampaignStats;
} & AuditInfo;

export type CampaignQueryParam = {
	campaign_name?: string;
	template_code?: string;
	statuses?: CampaignStatus[];
	types?: CampaignType[];
	channel?: CampaignChanel;
	time_start?: string;
	time?: string;
	level?: string;
	is_show_stats?: boolean;
	created_at_gte?: string;
	created_at_lte?: string;
} & Param;

export type CampaignPostBody = {
	active?: boolean;
	campaign_name: string;
	number_concurrency?: number;
	brandname_uuid: string;
	template_uuid: string;
	time_send?: string;
	type_send?: CampaignTypeSend;
};

export type CampaignPutBody = {
	campaign_name: string;
	is_user_pause?: boolean;
	number_concurrency?: number;
	time_end_running: string;
	time_start_running: string;
	time_send: string;
	type_send: CampaignTypeSend;
	active?: boolean;
	webhook_authorize_token?: string;
	webhook_url?: string;
};

export type CampaignPatchBody = {
	active?: boolean;
	campaign_name?: string;
	is_user_pause?: boolean;
	status?: CampaignStatus;
	time_end_running?: string;
	time_send?: string;
	time_start_running?: string;
	type_send?: CampaignTypeSend;
};

export type CampaignPostResponse = {
	active: boolean;
	campaign_name: string;
	campaign_uuid: string;
	created_at: Date;
	created_by: string;
	domain_uuid: string;
	number_concurrency: number;
	oa_id: string;
	status: string;
	template_uuid: string;
	type: string;
	updated_at: Date;
	updated_by: string;
};
