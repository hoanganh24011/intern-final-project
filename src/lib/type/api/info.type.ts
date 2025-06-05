export type Info = {
	channels: string[];
	error_codes: [{ code: number; type: string }];
	export_languages: string[];
	lead_statuses: string[];
	list_statuses: string[];
	message_statuses: string[];
	networks: [{ id: string; name: string }];
	sources: string[];
	upload_file_extensions: string[];
};
