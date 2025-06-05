export type ManualPostBody = {
	destinations: DestinationParam[];
	plugin_id: string;
	template_id: string;
};

export type DestinationParam = {
	list_param: any;
	phone_number: string;
};
