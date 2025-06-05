import { AuditInfo, Param } from "@type/common.type";

export type SupplierQueryParam = {
	sort_by: "asc" | "desc";
} & Param;

export type Supplier = {
	id: string;
	name: string;
	supplier_name: string;
	url: string;
	integrated_info: Record<string, string>;
	active: boolean;
} & AuditInfo;

export type Label = {
	en: string;
	vi: string;
};

export type IntegratedInfo = {
	field_name: string;
	data_type: string;
	required: boolean;
	labels: Label;
};

export type PartnerSchema = {
	name: string;
	integrated_info: IntegratedInfo[];
};

export type ConnectionSchema = {
	name: string;
	connection_info: IntegratedInfo[];
};
