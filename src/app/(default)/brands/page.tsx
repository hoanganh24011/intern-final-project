"use client";
import { useEffect, useState, useCallback, CSSProperties } from "react";
import InputForm from "@/src/components/shared/molecules/InputForm";
import { DefaultPageLayout } from "@/src/components/shared/templates";
import Button from "@/src/components/shared/molecules/Button";
import { useTranslations } from "next-intl";
import type { ChangeEvent } from "react";
import { Plus, RefreshCcw, ChevronDown, MoreVertical, Search } from "lucide-react";
import type { Brand } from "@/src/lib/type/api/brand.type";
import Pagination from "@components/shared/molecules/Pagination";
import ConfirmModal from "@components/shared/molecules/ConfirmModal";
import Modal from "@components/shared/molecules/Modal";
import { brandApiHeaders } from "@/src/lib/api/brand";
const searchInputStyle: CSSProperties = {
	width: "40px",
	transition: "width 0.3s",
	paddingRight: "28px",
};
const searchInputExpandedStyle: CSSProperties = {
	width: "220px",
	transition: "width 0.3s",
	paddingRight: "28px",
};
/**
 * state for BrandsPage component
 *
 */
const BrandsPage = () => {
	const t = useTranslations();
	const [brands, setBrands] = useState<Brand[]>([]);
	const [channelFilter, setChannelFilter] = useState<string>("");
	const [search, setSearch] = useState<string>("");
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [selectAll, setSelectAll] = useState<boolean>(false);
	const [showAddModal, setShowAddModal] = useState<boolean>(false);
	const [newBrand, setNewBrand] = useState<Omit<Brand, "id" | "created_at" | "updated_at">>({
		name: "",
		description: "",
		channel: "sms",
	});
	/**
	 * State for editing a brand
	 */
	const [editBrand, setEditBrand] = useState<Brand | null>(null);
	const [showActions, setShowActions] = useState<boolean>(false);
	const [searchFocused, setSearchFocused] = useState<boolean>(false);
	const [pageSize, setPageSize] = useState<number>(20);
	const [page, setPage] = useState<number>(1);
	const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);
	const [deleteBrandId, setDeleteBrandId] = useState<string | null>(null);
	/**
	 * Filter brands based on search and channel
	 * @param brands - The list of brands to filter
	 */
	const filteredBrands = brands.filter((brand) => {
		const matchSearch =
			typeof brand.name === "string" && search
				? brand.name.toLowerCase().includes(search.toLowerCase())
				: true;
		const matchChannel = channelFilter ? brand.channel === channelFilter : true;
		return matchSearch && matchChannel;
	});
	/**
	 * Calculate total results and apply pagination
	 */
	const totalResults = filteredBrands.length;
	const paginatedBrands = filteredBrands.slice((page - 1) * pageSize, page * pageSize);
	/**
	 * Handle select all brands in the current page
	 * @param checked - Whether to select all brands
	 */
	const handleSelectAll = useCallback(
		(checked: boolean) => {
			setSelectAll(checked);
			if (checked) {
				setSelectedBrands(paginatedBrands.map((b) => b.id));
			} else {
				setSelectedBrands([]);
			}
		},
		[paginatedBrands]
	);
	/**
	 * Handle selecting a single brand
	 * @param id - The ID of the brand
	 * @param checked - Whether the brand is selected
	 */
	const handleSelectBrand = useCallback((id: string, checked: boolean) => {
		setSelectedBrands((prev) => (checked ? [...prev, id] : prev.filter((bid) => bid !== id)));
	}, []);
	/**
	 * Handle input changes for brand fields
	 * @param field - The field to update
	 * @param value - The new value for the field
	 */
	const handleBrandInputChange = useCallback((field: string, value: string) => {
		setNewBrand((prev) => ({
			...prev,
			[field]: value,
		}));
	}, []);
	/**
	 * Handle adding or updating a brand
	 *
	 */
	const handleAddBrand = useCallback(async () => {
		const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
		if (editBrand) {
			try {
				const res = await fetch(`${API_BASE_URL}/sns/brands/${editBrand.id}`, {
					method: "PUT",
					headers: brandApiHeaders,
					body: JSON.stringify(newBrand),
				});
				if (res.ok) {
					const updated = await res.json();
					setBrands((prev) => prev.map((b) => (b.id === editBrand.id ? { ...b, ...updated } : b)));
				}
			} catch (error) {
				console.log(error);
			}
			setEditBrand(null);
		} else {
			try {
				const res = await fetch(`${API_BASE_URL}/sns/brands`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newBrand),
				});
				if (res.ok) {
					const created = await res.json();
					setBrands((prev) => [created, ...prev]);
				}
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
		setShowAddModal(false);
		setNewBrand({ name: "", description: "", channel: "sms" });
	}, [newBrand, editBrand]);
	/**
	 * Handle search input change
	 * @param e - The change event from the input
	 */
	const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	}, []);
	/**
	 * Handle page size change
	 * @param e - The change event from the select input
	 */
	const handleChannelChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			handleBrandInputChange("channel", e.target.value);
		},
		[handleBrandInputChange]
	);
	/**
	 * Handle showing the add brand modal
	 */
	const handleShowAddModal = useCallback(() => {
		setShowAddModal(true);
		setEditBrand(null);
		setNewBrand({ name: "", description: "", channel: "sms" });
	}, []);
	/**
	 * Handle hiding the add brand modal
	 */
	const handleHideAddModal = useCallback(() => {
		setShowAddModal(false);
		setEditBrand(null);
		setNewBrand({ name: "", description: "", channel: "sms" });
	}, []);
	/**
	 * Handle showing or hiding the actions dropdown
	 */
	const handleShowActions = useCallback(() => setShowActions((prev) => !prev), []);
	const handleReload = useCallback(() => {
		setShowActions(false);
		window.location.reload();
	}, []);
	/**
	 * Handle search input focus and blur events
	 */
	const handleSearchFocus = useCallback(() => setSearchFocused(true), []);
	const handleSearchBlur = useCallback(() => setSearchFocused(false), []);
	const handleMouseEnterSearch = useCallback(() => setSearchFocused(true), []);
	const handleMouseLeaveSearch = useCallback(() => {
		if (
			!document.activeElement ||
			!document.activeElement.classList.contains("search-expand-input")
		) {
			setSearchFocused(false);
		}
	}, []);
	/**
	 * Handle opening the row menu for a specific brand
	 * @param id - The ID of the brand
	 */
	const handleOpenRowMenu = useCallback((id: string) => setRowMenuOpen(id), []);
	const handleEditBrand = useCallback((brand: Brand) => {
		setEditBrand(brand);
		setNewBrand({
			name: brand.name,
			description: brand.description,
			channel: brand.channel,
		});
		setShowAddModal(true);
		setRowMenuOpen(null);
	}, []);
	/**
	 * Handle deleting a brand
	 * @param id - The ID of the brand to delete
	 */
	const handleDeleteBrand = useCallback(async (id: string) => {
		const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
		try {
			const res = await fetch(`${API_BASE_URL}/sns/brands/${id}`, {
				method: "DELETE",
				headers: brandApiHeaders,
			});
			if (res.ok) {
				setBrands((prev) => prev.filter((b) => b.id !== id));
			}
		} catch (error) {
			console.log(error);
		}
		setDeleteBrandId(null);
	}, []);
	/**
	 * Fetch brands data from the API
	 */
	const fetchData = useCallback(async () => {
		try {
			const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
			const res = await fetch(`${API_BASE_URL}/sns/brands`, {
				headers: brandApiHeaders,
			});

			if (res.ok) {
				const data = await res.json();
				if (Array.isArray(data)) {
					setBrands(data);
				} else if (Array.isArray(data.data)) {
					setBrands(data.data);
				} else {
					setBrands([]);
				}
			} else {
				setBrands([]);
			}
		} catch (error) {
			console.log(error);
			setBrands([]);
		}
	}, []);

	/**
	 * useEffect to fetch brands data from the API
	 */
	useEffect(() => {
		fetchData();
	}, []);
	/**
	 * useEffect to reset page when search, channelFilter, or pageSize changes
	 */
	useEffect(() => {
		setPage(1);
	}, [search, channelFilter, pageSize]);
	/**
	 * useEffect to handle click outside the row menu to close it handleClickOutside
	 */
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target.closest(".brand-row-menu")) {
				setRowMenuOpen(null);
			}
		};
		if (rowMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [rowMenuOpen]);

	return (
		<DefaultPageLayout breadcrumbs={[{ label: "brands_page.title", key: "brands" }]}>
			{/* Modal add/edit brand */}
			<Modal
				isOpen={showAddModal}
				setIsOpen={setShowAddModal}
				title={editBrand ? t("brands_page.edit_brand_title") : t("brands_page.add_brand_title")}
				cancelLabel={t("form.cancel")}
				confirmLabel={t("form.save")}
				onCancel={handleHideAddModal}
				onConfirm={handleAddBrand}
			>
				<div className="space-y-5">
					<InputForm
						label="brands_page.name"
						placeholder="Enter brand name"
						value={newBrand.name}
						onChange={(e) => handleBrandInputChange("name", e.target.value)}
					/>
					<InputForm
						label="brands_page.description"
						placeholder="Enter brand description"
						value={newBrand.description}
						onChange={(e) => handleBrandInputChange("description", e.target.value)}
					/>
					<label className="mb-1 block text-sm font-medium">Channel</label>
					<select
						value={newBrand.channel}
						onChange={handleChannelChange}
						className="min-w-[120px] rounded border px-2 py-1"
					>
						<option value="sms">{t("brands_page.channel_sms")}</option>
						<option value="zns">{t("brands_page.channel_zns")}</option>
						<option value="email">{t("brands_page.channel_email")}</option>
					</select>
				</div>
			</Modal>
			{/* Main content */}
			<div className="space-y-6 rounded bg-white px-6 py-8 shadow-sm dark:bg-gray-800">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-bold text-gray-800 dark:text-white">
						{t("brands_page.title")}
					</h1>
					<div className="flex gap-2">
						<Button icon={Plus} onClick={handleShowAddModal}>
							{t("brands_page.add_new_brand")}
						</Button>
						<div className="relative">
							<Button variant="secondary" onClick={handleShowActions} icon={ChevronDown}>
								{t("brands_page.other_actions")}
							</Button>
							{showActions && (
								<div className="absolute right-0 z-10 mt-2 w-48 rounded border bg-white shadow-lg">
									<Button
										variant="secondary"
										className="w-full justify-start gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
										onClick={handleReload}
										icon={RefreshCcw}
									>
										{t("brands_page.sync_data")}
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
				{/* Filter */}
				<div className="flex max-w-3xl items-center gap-4">
					<div
						className="relative flex items-center"
						onMouseEnter={handleMouseEnterSearch}
						onMouseLeave={handleMouseLeaveSearch}
					>
						<InputForm
							placeholder={t("brands_page.search_placeholder")}
							value={search}
							onChange={handleSearchChange}
							style={searchFocused || search ? searchInputExpandedStyle : searchInputStyle}
							className="search-expand-input rounded border px-2 py-1 pr-8 outline-none"
							onFocus={handleSearchFocus}
							onBlur={handleSearchBlur}
						/>
						<span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
							<Search size={18} />
						</span>
					</div>
					<select
						value={channelFilter}
						onChange={(e) => setChannelFilter(e.target.value)}
						className="min-w-[120px] rounded border px-2 py-1 focus:border-blue-500 focus:outline-none"
					>
						<option value="">Chọn kênh</option>
						<option value="sms">SMS</option>
						<option value="zns">ZNS</option>

						<option value="email">Email</option>
					</select>
				</div>
				<div className="mt-1 text-sm text-gray-500">
					{selectedBrands.length} {t("brands_page.selected_brands")}
				</div>
				{/* Brands list */}
				<div className="mt-4 border-t pt-4">
					<div className="grid grid-cols-12 items-center border-b pb-2 text-xs font-semibold text-gray-600">
						<div className="col-span-1 flex items-center">
							<input
								type="checkbox"
								checked={selectAll}
								onChange={(e) => handleSelectAll(e.target.checked)}
							/>
						</div>
						<div className="col-span-1">{t("brands_page.stt")}</div>
						<div className="col-span-3">{t("brands_page.name")}</div>
						<div className="col-span-5">{t("brands_page.description")}</div>
						<div className="c l-span-1 text-center">{t("brands_page.channel")}</div>
						<div className="col-span-1"></div>
					</div>
					{paginatedBrands.length === 0 && (
						<div className="py-4 text-center text-gray-400">{t("brands_page.no_results")}</div>
					)}
					{paginatedBrands.map((brand, index) => (
						<div
							key={brand.id + index}
							className="grid grid-cols-12 items-center border-b py-2 text-sm"
						>
							<div className="col-span-1 flex items-center">
								<input
									type="checkbox"
									checked={selectedBrands.includes(brand.id)}
									onChange={(e) => handleSelectBrand(brand.id, e.target.checked)}
								/>
							</div>
							<div className="col-span-1">{(page - 1) * pageSize + index + 1}</div>
							<div className="col-span-3">{brand.name}</div>
							<div className="col-span-5">{brand.description}</div>
							<div className="col-span-1 text-center">
								<span
									className={
										brand.channel === "sms"
											? "rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700"
											: brand.channel === "zns"
												? "rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
												: "rounded bg-green-100 px-2 py-0.5 text-xs text-green-700"
									}
								>
									{brand.channel}
								</span>
							</div>
							<div className="relative col-span-1 text-center">
								<Button
									className="p-1"
									variant="success"
									onClick={() => handleOpenRowMenu(brand.id)}
									icon={MoreVertical}
								/>
								{rowMenuOpen === brand.id && (
									<div className="brand-row-menu absolute right-0 z-20 mt-2 w-32 rounded border bg-white shadow-lg">
										<Button
											variant="info"
											className="flex w-full items-center justify-start gap-2 px-4 py-2"
											onClick={() => handleEditBrand(brand)}
										>
											{t("brands_page.edit")}
										</Button>
										<Button
											variant="danger"
											className="flex w-full items-center justify-start gap-2 px-4 py-2"
											onClick={() => {
												setDeleteBrandId(brand.id);
												setRowMenuOpen(null);
											}}
										>
											{t("brands_page.delete")}
										</Button>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
				{/* Pagination */}
				<Pagination
					totalItem={totalResults}
					pageSize={pageSize}
					currentPage={page}
					setPage={setPage}
					setPageSize={setPageSize}
				/>
			</div>
			{/* Modal confirm delete */}
			<ConfirmModal
				isOpen={!!deleteBrandId}
				setIsOpen={(open) => setDeleteBrandId(open ? deleteBrandId : null)}
				title={t("brands_page.confirm_delete_title")}
				confirmLabel={t("brands_page.delete")}
				cancelLabel={t("brands_page.cancel")}
				state="danger"
				onConfirm={() => {
					if (deleteBrandId) handleDeleteBrand(deleteBrandId);
				}}
				onCancel={() => setDeleteBrandId(null)}
			>
				{t("brands_page.confirm_delete_desc")}
			</ConfirmModal>
		</DefaultPageLayout>
	);
};
export default BrandsPage;
