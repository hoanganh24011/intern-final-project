"use client";

import { InputSearch } from "@components/shared/atoms";
import RangeDatePicker from "@components/shared/atoms/RangeDatePicker";
import { Button } from "@components/shared/molecules";
import { format } from "date-fns";
import { JSX, useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

/**
 * Template type
 */
interface Template {
	id: string;
	name: string;
	content: string;
	createdAt?: string;
}

/**
 * Brand type
 */
interface Brand {
	id: string;
	name: string;
}

/**
 * Fetch brands from API
 * @returns Promise<Brand[]>
 */
const fetchBrands = async (): Promise<Brand[]> => {
	const res = await fetch("https://demo-sms.vercel.app/api/sns/brands");
	const data = await res.json();
	return data.data || [];
};

/**
 * Fetch templates by brand id
 * @param brandId string
 * @returns Promise<Template[]>
 */
const fetchTemplatesByBrand = async (brandId: string): Promise<Template[]> => {
	const res = await fetch(`https://demo-sms.vercel.app/api/sns/templates?brand_id=${brandId}`);
	const data = await res.json();
	return data.data || [];
};

/**
 * Templates Demo Page
 * @returns JSX.Element
 */
const TemplatesPage = () => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [templates, setTemplates] = useState<Template[]>([]);
	const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
	const [selectAll, setSelectAll] = useState(false);
	const [search, setSearch] = useState("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [showDatePicker, setShowDatePicker] = useState(false);

	/**
	 * Fetch all brands and all templates on mount
	 */
	useEffect(() => {
		const fetchAll = async () => {
			const brandsData = await fetchBrands();
			setBrands(brandsData);

			// Fetch all templates for all brands
			let allTemplates: Template[] = [];
			for (const brand of brandsData) {
				const brandTemplates = await fetchTemplatesByBrand(brand.id);
				allTemplates = allTemplates.concat(
					brandTemplates.map((tpl, idx) => ({
						...tpl,
						brandId: brand.id,
						brandName: brand.name,
						createdAt: tpl.createdAt || new Date(Date.now() - idx * 86400000).toISOString(),
					}))
				);
			}
			setTemplates(allTemplates);
		};
		fetchAll();
	}, []);

	/**
	 * Handle select all templates
	 */
	const handleSelectAll = useCallback(
		(checked: boolean) => {
			setSelectAll(checked);
			if (checked) {
				setSelectedTemplateIds(templates.map((tpl) => tpl.id));
			} else {
				setSelectedTemplateIds([]);
			}
		},
		[templates]
	);

	/**
	 * Handle select single template
	 */
	const handleSelectTemplate = useCallback((templateId: string) => {
		setSelectedTemplateIds((prev) =>
			prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
		);
	}, []);

	/**
	 * Filter templates by search
	 */
	const filteredTemplates = templates.filter(
		(tpl) =>
			tpl.name.toLowerCase().includes(search.toLowerCase()) ||
			tpl.content.toLowerCase().includes(search.toLowerCase())
	);

	const filteredByDateTemplates = filteredTemplates.filter((tpl) => {
		const matchSearch =
			tpl.name.toLowerCase().includes(search.toLowerCase()) ||
			tpl.content.toLowerCase().includes(search.toLowerCase());

		if (!dateRange?.from) return matchSearch;
		const createdAt = tpl.createdAt ? new Date(tpl.createdAt) : null;
		if (!createdAt) return matchSearch;

		if (dateRange.from && !dateRange.to) {
			// So sánh đúng ngày
			return matchSearch && createdAt.toDateString() === dateRange.from.toDateString();
		}
		if (dateRange.from && dateRange.to) {
			// So sánh trong khoảng
			return matchSearch && createdAt >= dateRange.from && createdAt <= dateRange.to;
		}
		return matchSearch;
	});

	// Hiển thị label ngày đã chọn
	const dateLabel = dateRange?.from
		? dateRange.to
			? `${format(dateRange.from, "dd/MM/yyyy")}-${format(dateRange.to, "dd/MM/yyyy")}`
			: format(dateRange.from, "dd/MM/yyyy")
		: "";

	/**
	 * Render templates rows
	 */
	const renderRows = () => {
		let rows: JSX.Element[] = [];
		let idx = 1;
		for (const template of filteredByDateTemplates) {
			rows.push(
				<tr key={template.id} className="group border-b last:border-b-0 hover:bg-gray-50">
					<td className="px-2 py-2 text-center">
						<input
							type="checkbox"
							className="form-checkbox h-5 w-5 rounded border-gray-300 text-violet-500 transition checked:border-violet-500 checked:bg-violet-500"
							checked={selectedTemplateIds.includes(template.id)}
							onChange={() => handleSelectTemplate(template.id)}
						/>
					</td>
					<td className="px-2 py-2 text-center">{idx++}</td>
					<td className="px-2 py-2">{template.name}</td>
					<td className="px-2 py-2">{template.content}</td>
				</tr>
			);
		}
		return rows;
	};

	return (
		<div className="bg-white p-6">
			<h1 className="mb-4 text-2xl font-bold">Mẫu tin nhắn</h1>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<div className="px-1/2 py-1/2 flex items-center rounded-lg border border-gray-200 bg-white">
							<InputSearch
								className="border-0 bg-transparent px-1 py-0 text-sm focus:outline-none focus:ring-0"
								placeholder="Tìm kiếm mẫu tin nhắn"
								value={search}
								onChange={setSearch}
							/>
						</div>
						{/* Nút ngày tạo kiểu mới */}
						<button
							type="button"
							className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
							onClick={() => setShowDatePicker((v) => !v)}
						>
							<svg width="20" height="20" fill="none" viewBox="0 0 20 20">
								<rect width="20" height="20" fill="white" rx="10" />
								<path
									d="M10 5v5l3 3"
									stroke="#6B7280"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle cx="10" cy="10" r="7" stroke="#6B7280" strokeWidth="1.5" />
							</svg>
							<span>Ngày tạo</span>
						</button>
						{showDatePicker && (
							<div className="absolute z-50 mt-2">
								<div className="min-w-[350px] rounded-lg border bg-white p-4 shadow-lg">
									<div className="mb-2 text-xs font-semibold text-gray-500">NGÀY TẠO</div>
									<RangeDatePicker onSelectDate={setDateRange} className="mb-2" />
									<div className="mt-2 text-xs text-gray-500">
										{dateRange?.from && dateRange?.to
											? `Đã chọn: ${format(dateRange.from, "dd/MM/yyyy")}-${format(dateRange.to, "dd/MM/yyyy")}`
											: dateRange?.from
												? `Đã chọn: ${format(dateRange.from, "dd/MM/yyyy")}`
												: "Hãy chọn một ngày"}
									</div>
									<div className="mt-2 flex justify-between">
										<Button
											size="sm"
											variant="secondary"
											onClick={() => {
												setDateRange(undefined);
												setShowDatePicker(false);
											}}
										>
											Xóa bỏ
										</Button>
										<Button
											size="sm"
											variant="primary"
											onClick={() => setShowDatePicker(false)}
											disabled={!dateRange?.from}
										>
											Áp dụng
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
					{/* Dòng thương hiệu đã chọn */}
					<span className="mt-1 text-sm">
						<span className="font-semibold text-primary-600">{selectedTemplateIds.length}</span>{" "}
						thương hiệu được chọn
					</span>
				</div>
				<div className="flex gap-2">
					<Button size="sm" variant="primary">
						Thêm mẫu tin nhắn
					</Button>
					<Button size="sm" variant="secondary" className="flex items-center">
						Thao tác khác
					</Button>
				</div>
			</div>
			<div className="overflow-x-auto rounded-lg border">
				<table className="min-w-full bg-white text-sm">
					<thead>
						<tr className="bg-gray-100">
							<th className="w-10 px-2 py-2 text-center">
								<input
									type="checkbox"
									className="form-checkbox h-5 w-5 rounded border-gray-300 text-violet-500 transition checked:border-violet-500 checked:bg-violet-500"
									checked={selectAll}
									onChange={(e) => handleSelectAll(e.target.checked)}
								/>
							</th>
							<th className="w-12 px-2 py-2 text-center">STT</th>
							<th className="px-2 py-2 text-left">TÊN MẪU TIN NHẮN</th>
							<th className="px-2 py-2 text-left">NỘI DUNG MẪU TIN NHẮN</th>
						</tr>
					</thead>
					<tbody>
						{renderRows()}
						{filteredByDateTemplates.length === 0 && (
							<tr>
								<td colSpan={4} className="py-8 text-center text-gray-400">
									Không có mẫu tin nhắn
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TemplatesPage;
