"use client";

import React, { useCallback, useEffect, useState } from "react";
import SelectForm from "@/src/components/shared/molecules/SelectForm";
import InputForm from "@/src/components/shared/molecules/InputForm";
import { DefaultPageLayout } from "@components/shared/templates";
import { useTranslations } from "next-intl";
import { Button } from "@components/shared/molecules";
import { CirclePlus } from "lucide-react";

interface ReceiverData {
	phone: string;
	otp: string;
	number: string;
}

/**
 * Manual Page
 */
const ManualPage = () => {
	// Hooks
	const t = useTranslations();

	// States
	const [brands, setBrands] = useState([]);
	const [templates, setTemplates] = useState([]);
	const [selectedBrand, setSelectedBrand] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState("");
	const [formData, setFormData] = useState<ReceiverData[]>([{ phone: "", otp: "", number: "" }]);

	/**
	 * Handle change
	 * @param index number
	 * @param field keyof ReceiverData
	 * @param value string
	 */
	const handleChange = useCallback((index: number, field: keyof ReceiverData, value: string) => {
		setFormData((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [field]: value };
			return updated;
		});
	}, []);

	/**
	 * Add receiver
	 */
	const addReceiver = useCallback(() => {
		setFormData((prev) => [...prev, { phone: "", otp: "", number: "" }]);
	}, []);

	/**
	 * Remove receiver
	 */
	const removeReceiver = useCallback((index: number) => {
		setFormData((prev) => prev.filter((_, i) => i !== index));
	}, []);

	/**
	 * Handle reset
	 */
	const handleReset = () => {
		setSelectedBrand("");
		setSelectedTemplate("");
		setFormData([{ phone: "", otp: "", number: "" }]);
	};

	/**
	 * Handle send
	 */
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

	useEffect(() => {}, []);

	return (
		<DefaultPageLayout breadcrumbs={[{ label: "manuals_page.title", key: "manual" }]}>
			<div className="flex flex-row gap-4">
				{/* Area: Form */}
				<div className="flex flex-col gap-4">
					{/* Area: Channel */}
					<SelectForm
						label="manuals_page.channel"
						required
						options={[{ label: "SMS Brandname", value: "sms", noTranslate: true }]}
						placeholder="Chọn kênh"
						value="sms"
						onChange={() => {}}
						disabled
					/>

					{/* Area: Brand */}
					<SelectForm
						label="manuals_page.brand"
						required
						options={brands}
						placeholder="Chọn thương hiệu"
						value={selectedBrand}
						onChange={(e) => setSelectedBrand(e.target.value)}
					/>

					{/* Area: Template */}
					<SelectForm
						label="manuals_page.template"
						required
						options={templates}
						placeholder="Chọn mẫu tin nhắn"
						value={selectedTemplate}
						onChange={(e) => setSelectedTemplate(e.target.value)}
					/>

					{/* Area: Receivers */}
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
							<Button 
								size="md"
								variant="primary"
								onClick={addReceiver}
							>
								<CirclePlus size={16} className="mr-2" />
								{t("manuals_page.add_receiver")}
							</Button>
						</div>
					</div>

					{/* Area: Buttons */}
					<div className="mt-10 flex justify-end gap-3">
						{/* Area: Reset Button */}
						<Button 
							outline
							size="sm"
							variant="secondary"
						>
							{t("manuals_page.reset")}
						</Button>

						{/* Area: Send Button */}
						<Button 
							size="sm"
							variant="secondary"
						>
							{t("manuals_page.send")}
						</Button>
					</div>
				</div>

				{/* Area: Phone */}
			</div>
		</DefaultPageLayout>
	);
};

export default ManualPage;
