"use client";

import { RecipientTable } from "@components/shared/molecules/RecipientTable";
import { validateNumber, validateOtp, validatePhone } from "@utils/validate";
import { useCallback, useEffect, useState } from "react";

type Recipient = {
	phone: string;
	otp: string;
	number: number;
};

type Brand = { id: string; name: string };
type Template = { id: string; name: string; params: string[] };

const DEFAULT_RECIPIENTS: Recipient[] = [{ phone: "0703645462", otp: "123456", number: 5 }];

/**
 * DemoSmsPage component for sending SMS via brand and template selection.
 * Handles hydration, validation, and dynamic fetching of brands/templates.
 * @returns JSX.Element
 */
export default function DemoSmsPage() {
	/**
	 * State for recipients list.
	 */
	const [recipients, setRecipients] = useState<Recipient[]>(DEFAULT_RECIPIENTS);

	/**
	 * State for showing add recipient form.
	 */
	const [addForm, setAddForm] = useState(false);

	/**
	 * State for new recipient input.
	 */
	const [newRecipient, setNewRecipient] = useState<Recipient>({ phone: "", otp: "", number: 1 });

	/**
	 * State for input errors.
	 */
	const [errors, setErrors] = useState<{ [k: string]: string }>({});

	/**
	 * State to check if hydration is done.
	 */
	const [isHydrated, setIsHydrated] = useState(false);

	/**
	 * State for send error message.
	 */
	const [sendError, setSendError] = useState<string>("");

	/**
	 * State for brands list.
	 */
	const [brands, setBrands] = useState<Brand[]>([]);

	/**
	 * State for selected brand.
	 */
	const [selectedBrand, setSelectedBrand] = useState<string>("");

	/**
	 * State for templates list.
	 */
	const [templates, setTemplates] = useState<Template[]>([]);

	/**
	 * State for selected template.
	 */
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");

	/**
	 * Hydration effect: Loads recipients from localStorage on mount.
	 * Sets isHydrated to true after loading.
	 */
	useEffect(() => {
		const saved = localStorage.getItem("recipients");
		if (saved) {
			try {
				setRecipients(JSON.parse(saved));
			} catch {
				setRecipients(DEFAULT_RECIPIENTS);
			}
		}
		setIsHydrated(true);
	}, []);

	/**
	 * Effect to save recipients to localStorage whenever recipients or hydration state changes.
	 */
	useEffect(() => {
		if (isHydrated) {
			localStorage.setItem("recipients", JSON.stringify(recipients));
		}
	}, [recipients, isHydrated]);

	/**
	 * Effect to fetch brands from API after hydration.
	 * Sets the first brand as selected if available.
	 */
	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const res = await fetch("https://demo-sms.vercel.app/api/sns/brands");
				const data = await res.json();
				const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
				setBrands(arr);
				if (arr.length > 0) setSelectedBrand(arr[0].id);
			} catch {
				setBrands([]);
			}
		};
		fetchBrands();
	}, []);

	/**
	 * Effect to fetch templates when selectedBrand changes.
	 * Sets the first template as selected if available.
	 */
	useEffect(() => {
		if (!selectedBrand) {
			setTemplates([]);
			setSelectedTemplate("");
			return;
		}
		const fetchTemplates = async () => {
			try {
				const res = await fetch(
					`https://demo-sms.vercel.app/api/sns/templates?brand_id=${selectedBrand}`
				);
				const data = await res.json();
				const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
				setTemplates(arr);
				setSelectedTemplate(arr.length > 0 ? arr[0].id : "");
			} catch {
				setTemplates([]);
				setSelectedTemplate("");
			}
		};
		fetchTemplates();
	}, [selectedBrand]);

	/**
	 * Validates a Vietnamese phone number (must start with 0 and have 10 digits).
	 * @param phone string
	 * @returns string Error message or empty string if valid.
	 */
	const validatePhoneCb = useCallback(validatePhone, []);
	/**
	 * Validates OTP (must be 6 digits).
	 * @param otp string
	 * @returns string Error message or empty string if valid.
	 */
	const validateOtpCb = useCallback(validateOtp, []);
	/**
	 * Validates the number field (must be a positive integer).
	 * @param number number
	 * @returns string Error message or empty string if valid.
	 */
	const validateNumberCb = useCallback(validateNumber, []);

	/**
	 * Handles input change for recipient table.
	 * Updates the corresponding field for a recipient at a given index.
	 * @param idx number
	 * @param field keyof Recipient
	 * @param value string
	 */
	const handleInputChange = useCallback((idx: number, field: keyof Recipient, value: string) => {
		setRecipients((prev) => {
			const updated = [...prev];
			if (field === "number") {
				updated[idx][field] = Number(value);
			} else {
				updated[idx][field] = value;
			}
			return updated;
		});
	}, []);

	/**
	 * Removes a recipient from the list by index.
	 * @param idx number
	 */
	const handleRemove = useCallback((idx: number) => {
		setRecipients((prev) => prev.filter((_, i) => i !== idx));
	}, []);

	/**
	 * Handles input change for the add-new-recipient form.
	 * Updates the newRecipient state.
	 * @param field keyof Recipient
	 * @param value string
	 */
	const handleNewInput = useCallback((field: keyof Recipient, value: string) => {
		setNewRecipient((prev) => ({
			...prev,
			[field]: field === "number" ? Number(value) : value,
		}));
	}, []);

	/**
	 * Adds a new recipient to the list after validation.
	 * Resets the add form and errors if successful.
	 */
	const handleAddRecipient = useCallback(async () => {
		const phoneErr = validatePhoneCb(newRecipient.phone);
		const otpErr = validateOtpCb(newRecipient.otp);
		const numberErr = validateNumberCb(newRecipient.number);

		if (phoneErr || otpErr || numberErr) {
			setErrors({
				phone: phoneErr,
				otp: otpErr,
				number: numberErr,
			});
			return;
		}
		setRecipients((prev) => [...prev, newRecipient]);
		setNewRecipient({ phone: "", otp: "", number: 1 });
		setErrors({});
		setAddForm(false);
	}, [newRecipient, validatePhoneCb, validateOtpCb, validateNumberCb]);

	/**
	 * Resets recipients to default and clears localStorage.
	 */
	const handleReset = useCallback(async () => {
		setRecipients(DEFAULT_RECIPIENTS);
		localStorage.removeItem("recipients");
	}, []);

	/**
	 * Validates a single recipient row.
	 * @param r Recipient
	 * @returns Object with error messages for each field.
	 */
	const getRowError = useCallback(
		(r: Recipient) => ({
			phone: validatePhoneCb(r.phone),
			otp: validateOtpCb(r.otp),
			number: validateNumberCb(r.number),
		}),
		[validatePhoneCb, validateOtpCb, validateNumberCb]
	);

	/**
	 * Checks if the form is valid for sending.
	 * Ensures all recipients and selections are valid.
	 * @returns boolean
	 */
	const isFormValid = useCallback(() => {
		if (!selectedBrand || !selectedTemplate) return false;
		if (recipients.length === 0) return false;
		for (const r of recipients) {
			if (!r.phone || !r.otp || !r.number) return false;
			if (validatePhoneCb(r.phone) || validateOtpCb(r.otp) || validateNumberCb(r.number))
				return false;
		}
		return true;
	}, [
		recipients,
		selectedBrand,
		selectedTemplate,
		validatePhoneCb,
		validateOtpCb,
		validateNumberCb,
	]);

	/**
	 * Handles the send action.
	 * Validates all fields before sending and sets error if invalid.
	 */
	const handleSend = useCallback(() => {
		if (!isFormValid()) {
			setSendError("Vui lòng nhập đầy đủ và đúng thông tin.");
			return;
		}
		setSendError("");
		alert("Gửi thành công!");
	}, [isFormValid]);

	// Only render after hydration and brands loaded to avoid SSR/client mismatch and brands.map error
	if (!isHydrated || !Array.isArray(brands)) return null;

	return (
		<div className="flex flex-col gap-8 p-8 md:flex-row">
			{/* Left form */}
			<div className="flex-1 rounded bg-white p-6 shadow">
				<h2 className="mb-6 text-xl font-semibold">Gửi tin thủ công</h2>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						handleSend();
					}}
				>
					<div>
						<label className="mb-1 block font-medium">
							Kênh gửi <span className="text-red-500">*</span>
						</label>
						<select className="w-full rounded border px-3 py-2" disabled>
							<option>SMS Brandname</option>
						</select>
					</div>
					<div>
						<label className="mb-1 block font-medium">
							Thương hiệu <span className="text-red-500">*</span>
						</label>
						<select
							className="w-full rounded border px-3 py-2"
							value={selectedBrand}
							onChange={(e) => setSelectedBrand(e.target.value)}
							required
						>
							{brands.length === 0 && <option value="">Không có thương hiệu</option>}
							{brands.map((b) => (
								<option key={b.id} value={b.id}>
									{b.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-1 block font-medium">
							Mẫu tin nhắn <span className="text-red-500">*</span>
						</label>
						<select
							className="w-full rounded border px-3 py-2"
							value={selectedTemplate}
							onChange={(e) => setSelectedTemplate(e.target.value)}
							disabled={templates.length === 0}
							required
						>
							{templates.length === 0 && <option value="">Không có mẫu tin nhắn</option>}
							{templates.map((tpl) => (
								<option key={tpl.id} value={tpl.id}>
									{tpl.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-1 block font-medium">
							Thông tin người nhận <span className="text-red-500">*</span>
						</label>
						<RecipientTable
							recipients={recipients}
							getRowError={getRowError}
							handleInputChange={handleInputChange}
							handleRemove={handleRemove}
						/>
						{/* <table className="mb-2 w-full border">
							<thead>
								<tr className="bg-gray-100 text-left">
									<th className="border px-2 py-1">Số điện thoại</th>
									<th className="border px-2 py-1">OTP</th>
									<th className="border px-2 py-1">number</th>
									<th className="border px-2 py-1"></th>
								</tr>
							</thead>
							<tbody>
								{recipients.map((r, idx) => {
									const rowErr = getRowError(r);
									return (
										<tr key={idx}>
											<td className="border px-2 py-1">
												<input
													className={`w-full rounded border px-2 py-1 ${
														rowErr.phone ? "border-red-400" : ""
													}`}
													value={r.phone}
													onChange={(e) => handleInputChange(idx, "phone", e.target.value)}
												/>
												{rowErr.phone && <div className="text-xs text-red-500">{rowErr.phone}</div>}
											</td>
											<td className="border px-2 py-1">
												<input
													className={`w-full rounded border px-2 py-1 ${
														rowErr.otp ? "border-red-400" : ""
													}`}
													value={r.otp}
													onChange={(e) => handleInputChange(idx, "otp", e.target.value)}
												/>
												{rowErr.otp && <div className="text-xs text-red-500">{rowErr.otp}</div>}
											</td>
											<td className="border px-2 py-1">
												<input
													type="number"
													min={1}
													className={`w-full rounded border px-2 py-1 ${
														rowErr.number ? "border-red-400" : ""
													}`}
													value={r.number}
													onChange={(e) => handleInputChange(idx, "number", e.target.value)}
												/>
												{rowErr.number && (
													<div className="text-xs text-red-500">{rowErr.number}</div>
												)}
											</td>
											<td className="border px-2 py-1 text-center">
												<button
													type="button"
													className="text-gray-400 hover:text-red-500"
													title="Xóa"
													onClick={() => handleRemove(idx)}
													disabled={recipients.length === 1}
												>
													🗑️
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table> */}
						{/* Add new recipient form */}
						{addForm ? (
							<div className="mt-2 flex items-end gap-2">
								<div>
									<input
										className={`rounded border px-2 py-1 ${errors.phone ? "border-red-400" : ""}`}
										placeholder="Số điện thoại"
										value={newRecipient.phone}
										onChange={(e) => handleNewInput("phone", e.target.value)}
									/>
									{errors.phone && <div className="text-xs text-red-500">{errors.phone}</div>}
								</div>
								<div>
									<input
										className={`rounded border px-2 py-1 ${errors.otp ? "border-red-400" : ""}`}
										placeholder="OTP"
										value={newRecipient.otp}
										onChange={(e) => handleNewInput("otp", e.target.value)}
									/>
									{errors.otp && <div className="text-xs text-red-500">{errors.otp}</div>}
								</div>
								<div>
									<input
										type="number"
										min={1}
										className={`w-16 rounded border px-2 py-1 ${
											errors.number ? "border-red-400" : ""
										}`}
										placeholder="number"
										value={newRecipient.number}
										onChange={(e) => handleNewInput("number", e.target.value)}
									/>
									{errors.number && <div className="text-xs text-red-500">{errors.number}</div>}
								</div>
								<button
									type="button"
									className="rounded bg-blue-600 px-3 py-1 text-white"
									onClick={handleAddRecipient}
								>
									Lưu
								</button>
								<button
									type="button"
									className="px-2 text-gray-500"
									onClick={() => {
										setAddForm(false);
										setErrors({});
									}}
								>
									Hủy
								</button>
							</div>
						) : (
							<button
								type="button"
								className="mt-2 flex items-center gap-1 rounded border border-blue-600 px-3 py-1 text-blue-600"
								onClick={() => setAddForm(true)}
							>
								<span className="text-xl">＋</span> Thêm người nhận
							</button>
						)}
					</div>
					{sendError && <div className="mb-2 text-sm text-red-500">{sendError}</div>}
					<div className="mt-4 flex justify-end gap-2">
						<button
							type="button"
							className="rounded border border-orange-400 px-4 py-2 text-orange-500 hover:bg-orange-50"
							onClick={handleReset}
						>
							Đặt lại
						</button>
						<button
							type="submit"
							className="rounded bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
							disabled={!isFormValid()}
						>
							Gửi
						</button>
					</div>
				</form>
			</div>
			{/* SMS mockup right panel */}
			<div className="flex w-full justify-center md:w-[350px]">
				<div className="flex h-[600px] w-[320px] flex-col rounded-3xl bg-gray-100 p-4 shadow-lg">
					{/* Phone header */}
					<div className="mb-2 flex flex-col items-center">
						<div className="mb-2 mt-2 h-2 w-16 rounded-full bg-gray-300"></div>
						<div className="flex items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-2xl">
								👤
							</div>
							<div>
								<div className="font-semibold">TEL4VN</div>
								<div className="text-xs text-gray-400">Today 11:11</div>
							</div>
						</div>
					</div>
					{/* SMS content */}
					<div className="flex flex-1 items-end">
						<div className="rounded-xl bg-white p-3 text-gray-700 shadow">
							<span>
								Mã OTP của bạn là <span className="font-bold text-blue-600">123456</span>. Tuyệt đối
								KHÔNG chia sẻ mã xác thực (OTP) cho bất kỳ ai dưới bất kỳ hình thức nào. Mã xác thực
								có hiệu lực trong 5 phút.
							</span>
						</div>
					</div>
					{/* SMS input mockup */}
					<div className="mt-4 flex items-center gap-2">
						<input
							className="flex-1 rounded-full border bg-gray-50 px-4 py-2"
							placeholder="SMS"
							disabled
						/>
						<button className="text-2xl text-gray-400" disabled>
							＋
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
