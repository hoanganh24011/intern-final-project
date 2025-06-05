import { Param } from "@type/common.type";

type Channel = "sms" | "zns" | "autocall";
type TimeInterval = "hour" | "day" | "month";

export type SendingHistory = {
	campaign_id: string;
	campaign_name: string;
	channel: Channel;
	created_at: string;
	error_code: string;
	id: string;
	is_charged_zns: boolean;
	list_param?: string[];
	message: string;
	network: string;
	phone_number: string;
	quantity: number;
	status: string[];
	telco: number;
	template_id: string;
	template_name: string;
	tenant_id: string;
};

export type SendingHistoryQueryParam = {
	id?: string;
	campaign_id?: string[];
	external_id?: string[];
	plugin_id?: string[];
	template_id?: string[];
	phone_number?: string;
	message?: string;
	telco_id?: string[];
	channel?: Channel[];
	status?: string[];
	error_code?: string[];
	quantity?: number;
	network?: string[];
	start_time?: string;
	end_time?: string;
	is_charged_zns?: boolean;
	time_interval?: TimeInterval;
} & Param;
