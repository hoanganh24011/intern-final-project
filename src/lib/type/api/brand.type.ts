import { AuditInfo, Param } from "@type/common.type";

export type Brand = {
	id: string;
	name: string;
	description: string;
	channel: string;
} & AuditInfo;

export type BrandQueryParams = {
	name?: string;
	channel?: string;
} & Param;
