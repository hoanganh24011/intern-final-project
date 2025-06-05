import { Param } from "@type/common.type";

export type OA = {
	avatar: string;
	created_at: string;
	oa_id: string;
	oa_name: string;
	oa_provider: string;
	status: boolean;
};

export type OAQueryParam = Param & {
	oa_name?: string;
	oa_provider?: string;
};
