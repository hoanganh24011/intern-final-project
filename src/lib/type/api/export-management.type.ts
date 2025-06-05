import { Param } from "@type/common.type";
export type ExportData = {
	domain_uuid: string;
	export_time: string;
	export_time_finish: string;
	id: string;
	folder: string;
	name: string;
	path: string;
	status: string;
	total_rows: number;
	type: string;
	url: string;
	user_uuid: string;
};

export type ExportQueryParams = {
	name?: string;
	export_time_gte?: string;
	export_time_lte?: string;
	statuses?: string[];
} & Param;
