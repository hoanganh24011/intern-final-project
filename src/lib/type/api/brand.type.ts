import { AuditInfo, Param } from "@type/common.type";

export type Brand = {
	id: string;
	name: string;
	description: string;
	channel: string;
	created_at?: string;
	updated_at?: string;
};

export type BrandResponse = {
	code: string;
	message: string;
	total?: number;
	data: Brand[];
};

export type BrandQueryParams = {
	name?: string;
	channel?: string;
} & Param;
