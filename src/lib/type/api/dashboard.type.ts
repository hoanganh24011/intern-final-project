import { Param } from "@type/common.type";

export type Channel = "sms" | "zns" | "autocall";
export type TimeInterval = "hour" | "day" | "month";

export type Stats = {
	domain_uuid: string;
	business_unit_id: string;
	start_time: string;
	end_time: string;
	oa_count: number;
	campaign_count: number;
	template_count: number;
	campaign_messages_count: number;
	success_messages_count: number;
	failed_messages_count: number;
	sent_messages_percent: number;
};

export type StatsQueryParam = {
	id?: string;
	campaign_id?: string[];
	external_id?: string[];
	plugin_id?: string[];
	template_id?: string[];
	list_id?: string[];
	phone_number?: string;
	message?: string;
	telco_id?: string[];
	channel?: Channel[];
	status?: string[];
	error_code?: string[];
	quantity?: string;
	network?: string[];
	start_time?: string;
	end_time?: string;
	is_charged_zns?: string;
	time_interval?: TimeInterval;
	business_unit_id?: string;
} & Param;

export type ChannelStat = {
	channels: [{ channel: Channel; count: number }];
	timestamp: number;
	time_string: string;
};

export type ChannelStatsInterval = {
	business_unit_id: string;
	channels_stat: ChannelStat[];
	domain_uuid: string;
	end_time: string;
	start_time: string;
	time_interval: TimeInterval;
};

export type NetworkStat = {
	networks: [{ network: string; count: number }];
	timestamp: number;
	time_string: string;
};

export type NetworkStatsInterval = {
	business_unit_id: string;
	domain_uuid: string;
	networks_stat: NetworkStat[];
	end_time: string;
	start_time: string;
	time_interval: TimeInterval;
};

export type ErrorStats = {
	total_errors: number;
	errors: [{ code: number; type: string; total: number }];
};
