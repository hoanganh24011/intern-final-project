"use client";

import { ActionMenu, Chip, InputSearch } from "@components/shared/atoms";
import { BreadcrumbItem } from "@components/shared/atoms/Breadcrumb";
import { Button, Filter, Pagination } from "@components/shared/molecules";
import { FilterItemConfig } from "@components/shared/molecules/FilterItem";
import { DefaultPageLayout } from "@components/shared/templates";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import parse from "html-react-parser";
import { DataTable } from "@components/shared/organisms";
import { Trash2 } from "lucide-react";
import { TableRow } from "@components/shared/organisms/DataTable";
import { ColumnType, TableColumn } from "@type/component/table.type";

const BrandsPage = () => {
	// Hooks
	const t = useTranslations();

	// States
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataTable, setDataTable] = useState<TableRow[]>([]);
	const [param, setParam] = useState<Record<string, any>>({});
	const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
	const [selectedBrands, setSelectedBrands] = useState<TableRow[]>([]);
	const [notSelectedBrands, setNotSelectedBrands] = useState<TableRow[]>([]);
	const [filters, setFilters] = useState<Record<string, FilterItemConfig>>({});

	// Constants
	const BRANDS_BREADCRUMBS: BreadcrumbItem[] = [
		{
			key: "brands_page",
			label: "brands_page.title",
		},
	];
	const TABLE_BRANDS_COLUMN: TableColumn<TableRow>[] = [
		{
			key: "name",
			dataType: ColumnType.TEXT,
			label: "brands_page.name",
		},
		{
			key: "description",
			dataType: ColumnType.TEXT,
			label: "brands_page.description",
		},
		{
			key: "channel",
			dataType: ColumnType.ACTION,
			label: "brands_page.channel",
			component: [
				{
					component: Chip,
					props: (_row) => {
						return {
							size: "xs",
							label: "sms",
							variant: "danger",
							noTranslate: true,
						};
					},
				},
			],
		},
	];

	/**
	 * Handle get brands
	 */
	const handleGetBrands = useCallback(() => {}, []);

	/**
	 * Handle open create brand modal
	 */
	const handleOpenCreateBrandModal = useCallback(() => {}, []);

	/**
	 * Handle open delete modal
	 */
	const handleOpenDeleteModal = useCallback(() => {}, []);

	/**
	 * Handle select all
	 * @param value boolean
	 */
	const handleSelectedAll = useCallback(
		(value: boolean) => {
			setIsSelectAll(value);
			if (value) {
				setSelectedBrands(dataTable);
			} else {
				setSelectedBrands([]);
			}
		},
		[dataTable]
	);

	return (
		<DefaultPageLayout breadcrumbs={BRANDS_BREADCRUMBS}>
			<div className="mt-2 flex flex-col gap-2">
				{/* Area: Right Action */}
				<div className="flex justify-between gap-2">
					<div className="flex gap-2">
						{/* Area: Input Search */}
						<InputSearch minLength={5} placeholder="brands_page.search_brand" />

						{/* Area: Filter */}
						<Filter
							param={param}
							filters={filters}
							onParamChange={setParam}
							onFilter={handleGetBrands}
						/>
					</div>

					{/* Area: Left Action */}
					<div className="flex gap-2">
						{/* Area: Add List */}
						<Button size="sm" onClick={handleOpenCreateBrandModal}>
							{t("brands_page.add_new_brand")}
						</Button>

						{/* Area: Action Menu */}
						<ActionMenu label="form.other_action" actions={[]} />
					</div>
				</div>

				{/* Area: Count Brands */}
				<span>
					{parse(
						t("brands_page.selected_brand", {
							number: `<b className='text-primary-500'>${isSelectAll ? totalItem - notSelectedBrands.length : (selectedBrands.length ?? 0)}</b>`,
						})
					)}
				</span>

				{/* Area: Table Lead */}
				<DataTable
					id="brands-table"
					showAction
					data={dataTable}
					showActionColumn
					currentPage={page}
					pageSize={pageSize}
					totalItem={totalItem}
					isLoading={isLoading}
					columns={TABLE_BRANDS_COLUMN}
					selectedList={selectedBrands}
					notSelectedList={notSelectedBrands}
					selectedAll={isSelectAll}
					actionColumnOptions={[
						{
							label: "form.delete",
							icon: <Trash2 size={16} />,
							className: "text-danger-500",
							onClick: handleOpenDeleteModal,
						},
					]}
					onSelectRow={setSelectedBrands}
					onSelectAll={handleSelectedAll}
					onDeselectRow={setNotSelectedBrands}
				/>

				{/* Area: Pagination */}
				{dataTable.length > 0 && (
					<Pagination
						currentPage={page}
						pageSize={pageSize}
						totalItem={totalItem}
						setPage={setPage}
						setPageSize={setPageSize}
					/>
				)}
			</div>
		</DefaultPageLayout>
	);
};

export default BrandsPage;
