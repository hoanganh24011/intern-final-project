export type ReportParam = {
	start_time: string;
	end_time: string;
	limit?: number;
	offset?: number;
	channel?: string;
	file_type?: string;
};

export type Report = {
	detailed_report: {
		failed_report: {
			percent: number;
			quantity: number;
		};
		key: string;
		successful_report: {
			percent: number;
			quantity: number;
		};
		template_name: string;
		total_quantity: number;
	}[];
	total_quantity: number;
};

export type ReportTable = {
	channel: string;
	quantity: number;
	successful_report_quantity: number;
	successful_report_percent: number;
	failed_report_quantity: number;
	failed_report_percent: number;
};
