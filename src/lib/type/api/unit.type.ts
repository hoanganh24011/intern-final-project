import { AuditInfo, Param } from "@type/common.type";

export type UnitConfig = {
	api_url: string;
	google_api_key: string;
	is_recording: boolean;
	logo: string;
	partner: string;
	payment_cost: string;
	version: string;
	zalo_api_key: string;
};

export type UnitSocial = {
	facebook: string;
	gmail: string;
	google: string;
	instagram: string;
	linkedin: string;
	skype: string;
	telegram: string;
	tiktok: string;
	twitter: string;
	website: string;
	youtube: string;
	zalo: string;
};

export type UnitData = {
	account_number: string;
	address: string;
	bank_name: string;
	brand_name: string;
	city: string;
	country: string;
	date_of_incorporation: string;
	domain_uuid: string;
	email: string;
	level: number;
	note: string;
	parent_unit_uuid: string;
	phone_number: string;
	status: boolean;
	tax_code: string;
	unit_basis: boolean;
	unit_code: string;
	unit_config: UnitConfig;
	unit_leader: string;
	unit_name: string;
	unit_social: UnitSocial;
	unit_uuid: string;
} & AuditInfo;

export type UnitQueryParam = {
	domain_uuid?: string;
	parent_unit_uuid?: string;
	unit_uuid?: string;
	unit_name?: string;
	unit_code?: string;
	unit_leader?: string;
	status?: boolean;
	level?: string;
} & Param;

export type UnitBody = {
	account_number: string;
	address: string;
	bank_name: string;
	brand_name: string;
	city: string;
	country: string;
	date_of_incorporation: string;
	domain_uuid: string;
	email: string;
	note: string;
	parent_unit_uuid: string;
	phone_number: string;
	status: boolean;
	tax_code: string;
	unit_basis: boolean;
	unit_code: string;
};
