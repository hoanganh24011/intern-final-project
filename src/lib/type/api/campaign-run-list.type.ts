export type RunListParam = { key: string; value: string };

export type CampaignRunListPostBody = {
	campaign_uuid: string;
	list_uuid: string;
	param: RunListParam[];
};

export type CampaignRunListPostResponse = {
	campaign_uuid: string;
	created_at: Date;
	domain_uuid: string;
	id: string;
	list_uuid: string;
	param: null;
	run_uuid: string;
	updated_at: Date;
};
