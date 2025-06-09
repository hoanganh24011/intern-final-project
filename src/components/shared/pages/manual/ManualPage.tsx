"use client";

import React, { useCallback, useEffect, useState } from "react";
import SelectForm from "@/src/components/shared/molecules/SelectForm";
import InputForm from "@/src/components/shared/molecules/InputForm";
import { DefaultPageLayout } from "@components/shared/templates";
import { useTranslations } from "next-intl";

interface ReceiverData {
	phone: string;
	otp: string;
	number: string;
}

const ManualPage = () => {
	// Hooks
	const t = useTranslations();

	const [formData, setFormData] = useState<ReceiverData[]>([{ phone: "", otp: "", number: "" }]);
	const [brands, setBrands] = useState([]);
	const [templates, setTemplates] = useState([]);
	const [selectedBrand, setSelectedBrand] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState("");

	
	const handleChange = useCallback((index: number, field: keyof ReceiverData, value: string) => {
		setFormData((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [field]: value };
			return updated;
		});
	}, []);

	const addReceiver = useCallback(() => {
		setFormData((prev) => [...prev, { phone: "", otp: "", number: "" }]);
	}, []);

	const removeReceiver = useCallback((index: number) => {
		setFormData((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleReset = () => {
		setSelectedBrand("");
		setSelectedTemplate("");
		setFormData([{ phone: "", otp: "", number: "" }]);
	};

	const handleSend = async () => {
		try {
			const res = await fetch("https://demo-sms.vercel.app/api/sns/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					template_id: selectedTemplate,
					destinations: formData.map((item) => ({
						phone_number: item.phone,
						list_param: {
							OTP: item.otp,
							number: item.number,
						},
					})),
				}),
			});

			const result = await res.json();
			if (res.ok) {
				alert(" Gửi tin thành công!");
				handleReset();
			} else {
				alert(` Lỗi: ${result.message || "Không gửi được."}`);
			}
		} catch (error) {
			alert(" Có lỗi xảy ra khi gửi tin.");
			console.error(error);
		}
	};

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const res = await fetch("https://demo-sms.vercel.app/api/sns/brands");
				const data = await res.json();
				const formatted = data.map((item: any) => ({
					label: item.name,
					value: item.id,
					noTranslate: true,
				}));
				setBrands(formatted);
			} catch (error) {
				console.error("Lỗi khi tải thương hiệu:", error);
			}
		};
		fetchBrands();
	}, []);


	useEffect(() => {
		if (!selectedBrand) return;
		const fetchTemplates = async () => {
			try {
				const res = await fetch(
					`https://demo-sms.vercel.app/api/sns/templates?brand_id=${selectedBrand}`
				);
				const data = await res.json();
				const formatted = data.map((item: any) => ({
					label: item.name,
					value: item.id,
					noTranslate: true,
				}));
				setTemplates(formatted);
			} catch (error) {
				console.error("Lỗi khi tải mẫu tin nhắn:", error);
			}
		};
		fetchTemplates();
	}, [selectedBrand]);

	return (
		<DefaultPageLayout breadcrumbs={[{ label: "manuals_page.title", key: "manual" }]}>
			<div className="rounded bg-white px-6 py-8 shadow-sm dark:bg-gray-800">
				<h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
					{t("manuals_page.title")}
				</h1>

				{/* Form lựa chọn */}
				<div className="max-w-4xl space-y-4">
					<SelectForm
						label="manuals_page.channel"
						required
						options={[{ label: "SMS Brandname", value: "sms", noTranslate: true }]}
						placeholder="Chọn kênh"
						value="sms"
						onChange={() => {}}
						disabled
					/>
					<SelectForm
						label="manuals_page.brand"
						required
						options={brands}
						placeholder="Chọn thương hiệu"
						value={selectedBrand}
						onChange={(e) => setSelectedBrand(e.target.value)}
					/>
					<SelectForm
						label="manuals_page.template"
						required
						options={templates}
						placeholder="Chọn mẫu"
						value={selectedTemplate}
						onChange={(e) => setSelectedTemplate(e.target.value)}
					/>
				</div>

				{/* Bảng người nhận */}
				<div className="mt-8">
					<h3 className="mb-2 text-base font-semibold">Thông tin người nhận *</h3>

					{/* Header bảng */}
					<div className="mb-3 grid grid-cols-12 gap-4 border-b pb-2 text-sm font-semibold">
						<div className="col-span-4">Số điện thoại</div>
						<div className="col-span-4">OTP</div>
						<div className="col-span-3">number</div>
						<div className="col-span-1 text-center"></div>
					</div>

					{/* Dòng dữ liệu */}
					<div className="space-y-3">
						{formData.map((data, index) => (
							<div key={index} className="grid grid-cols-12 items-center gap-4 border-b pb-2">
								<div className="col-span-4">
									<InputForm
										label=""
										type="tel"
										required
										value={data.phone}
										onChange={(e) => handleChange(index, "phone", e.target.value)}
									/>
								</div>
								<div className="col-span-4">
									<InputForm
										label=""
										type="text"
										required
										value={data.otp}
										onChange={(e) => handleChange(index, "otp", e.target.value)}
									/>
								</div>
								<div className="col-span-3">
									<InputForm
										label=""
										type="number"
										required
										value={data.number}
										onChange={(e) => handleChange(index, "number", e.target.value)}
									/>
								</div>
								<div className="col-span-1 flex justify-center">
									<button
										className="text-red-600 hover:text-red-800"
										onClick={() => removeReceiver(index)}
										disabled={formData.length === 1}
									>
										🗑️
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Nút thêm người nhận */}
					<div className="mt-4">
						<button
							className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
							onClick={addReceiver}
						>
							➕ Thêm người nhận
						</button>
					</div>
				</div>

				{/* Nút hành động */}
				<div className="mt-10 flex justify-end gap-3">
					<button
						className="rounded border border-orange-500 px-6 py-2 text-orange-500 hover:bg-orange-50"
						onClick={handleReset}
					>
						Đặt lại
					</button>
					<button
						className="rounded bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
						onClick={handleSend}
					>
						Gửi
					</button>
				</div>
			</div>
		</DefaultPageLayout>
	);
};

export default ManualPage;
