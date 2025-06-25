"use client";

import SelectForm from "@/src/components/shared/molecules/SelectForm";

import { apiGetBrands } from "@api/brand";
import { apiCreateMessage } from "@api/message";

import {  apiGetTemplateById, apiGetTemplates } from "@api/template";
import { SMSReview } from "@components/shared/atoms";
import { Button } from "@components/shared/molecules";
import ReceiverTable, { RowData } from "@components/shared/molecules/ReceiverTable";
import { DefaultPageLayout } from "@components/shared/templates";
import { BrandQueryParams } from "@type/api/brand.type";
import { MessageBody } from "@type/api/message.type";
import { Templates, TemplatesQueryParams } from "@type/api/template.type";
import { SelectOption } from "@type/common.type";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { object, string } from "yup";

const ManualPage = () => {

	//Hooks
	const t = useTranslations();

	//States
	const [rows, setRows] = useState<RowData[]>([]);
	const [sampleContent, setSampleContent] = useState<string>("");
	const [template, setTemplate] = useState<Templates | null>(null);
	const [brandOptions, setBrandOptions] = useState<SelectOption[]>([]);
	const [templatesOptions, setTemplatesOptions] = useState<SelectOption[]>([]);


	//Memoized
	const initialValues = useMemo(
		() => ({
			channel: "sms",
			brand: "",
			template_id: "",
		}),
		[]
	);

	const validationSchema = useMemo(
		() =>
			object().shape({
				channel: string().oneOf(["sms", "zns", "email"], t("error_message.invalid_value")),
				brand: string().required(t("error_message.required")),
				template_id: string().required(t("error_message.required")),
			}),
		[]
	);

	//Formik
	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			const body: MessageBody = {
				template_id: values.template_id,
				destinations: rows.map((row) => ({
					phone_number: row.phone_number,
					list_param: row.list_param,
				})),
			};

			try {
				const response = await apiCreateMessage(body);
				if (response.code !== "OK") {
					return toast.error(t("sending_manuals_page.create_message_failed"));
				}
				toast.success(t("sending_manuals_page.create_message_success"));
				resetForm();
			} catch {
				toast.error(t("sending_manuals_page.create_message_failed"));
			}
		},
	});

	const isDisabled = useMemo(() => {
		const missingParams = rows.some(
			(row) => !row.phone_number || Object.values(row.list_param).some((val) => !val)
		);
		return (
			!formik.values.brand ||
			!formik.values.channel ||
			!formik.values.template_id ||
			missingParams ||
			formik.isSubmitting
		);
	}, [formik.values, rows, formik.isSubmitting]);


	/**
	 * HandleGetBrands
	 */
	const handleGetBrands = useCallback(async () => {
		try {
			const params: BrandQueryParams = { channel: formik.values.channel };
			const response = await apiGetBrands(params);
			if (response.code !== "OK") {
				console.log("enter day")
				return toast.error(
					t("api.get.failed", { data: t("sending_manuals_page.brand_list").toLowerCase() })
				);
			}

			const {data} = response;

			const options = data.map((item) => ({
				label: item.name!,
				value: item.id!,
				noTranslate: true,
			}));
			setBrandOptions(options);
		} catch {
			toast.error(
				t("api.get.failed", { data: t("sending_manuals_page.brand_list").toLowerCase() })
			);
		}
	}, [formik.values.channel]);


	/**
	 * Handle Get Templates
	 */
	const handleGetTemplates = useCallback(async () => {
		try {
			const params: TemplatesQueryParams = {
				brand_id: formik.values.brand,
			};
			const response = await apiGetTemplates(params);
			if (response.code !== "OK") {
				return toast.error(
					t("api.get.failed", { data: t("sending_manuals_page.template_list").toLowerCase() })
				);
			}
			const options = response.data.map((item) => ({
				label: item.name!,
				value: item.id!,
				noTranslate: true,
			}));
			setTemplatesOptions(options);
		} catch {
			toast.error(
				t("api.get.failed", { data: t("sending_manuals_page.template_list").toLowerCase() })
			);
		}
	}, [formik.values.brand]);


	/**
	 * Handle Get TemplateById
	 */
	const handleGetTemplateById = useCallback(async () => {
		try {
			const response = await apiGetTemplateById(formik.values.template_id);
			if (response.code !== "OK") {
				return toast.error(
					t("api.get.failed", { data: t("sending_manuals_page.template").toLowerCase() })
				);
			}
			setTemplate(response.data);
		} catch {
			toast.error(t("api.get.failed", { data: t("sending_manuals_page.template").toLowerCase() }));
		}
	}, [formik.values.template_id]);


	/**
	 * Reset Form
	 */
	const resetForm = useCallback(() => {
		formik.resetForm();
		setTemplate(null);
		setRows([{ id: crypto.randomUUID(), phone_number: "", list_param: {} }]);
	}, []);


	
	useEffect(() => {
		handleGetBrands();
	}, []);

	useEffect(() => {
		handleGetTemplates();
	}, [formik.values.brand]);

	useEffect(() => {
		if (!formik.values.template_id) return setTemplate(null);
		handleGetTemplateById();
		setRows([{ id: crypto.randomUUID(), phone_number: "", list_param: {} }]);
	}, [formik.values.template_id]);

	useEffect(() => {
		const params = rows[0]?.list_param || {};
		const content = template?.content.replace(/{{(.*?)}}/g, (_, key) => params[key] || "") ?? "";
		setSampleContent(content);
	}, [rows, template]);

	return (
		<DefaultPageLayout breadcrumbs={[{ label: "manuals_page.title", key: "manual" }]}>
			<form onSubmit={formik.handleSubmit} className="flex items-start gap-6">
				<div className="flex flex-[2] flex-col gap-6">
					<SelectForm
						id="channel"
						name="channel"
						label="manuals_page.channel"
						placeholder={t("select.placeholder", {
							data: t("sending_manuals_page.channel").toLowerCase(),
						})}
						options={[
							{ value: "sms", label: t("sending_manuals_page.channel_sms"), noTranslate: true },
							{ value: "zns", label: t("sending_manuals_page.channel_zns"), noTranslate: true },
							{ value: "email", label: t("sending_manuals_page.channel_email"), noTranslate: true },
						]}
						errorMessage={formik.errors.channel}
						value={formik.values.channel}
						onChange={formik.handleChange}
					/>

					<SelectForm
						id="brand"
						name="brand"
						label="manuals_page.brand"
						placeholder={t("select.placeholder", {
							data: t("sending_manuals_page.brand").toLowerCase(),
						})}
						options={brandOptions}
						errorMessage={formik.errors.brand}
						value={formik.values.brand}
						onChange={formik.handleChange}
					/>

					<SelectForm
						id="template_id"
						name="template_id"
						label="manuals_page.template"
						placeholder={t("select.placeholder", {
							data: t("sending_manuals_page.template").toLowerCase(),
						})}
						options={templatesOptions}
						errorMessage={formik.errors.template_id}
						value={formik.values.template_id}
						onChange={formik.handleChange}
					/>

					{template && <ReceiverTable params={template.params} rows={rows} setRows={setRows} />}

					<div className="mt-6 flex justify-end gap-3">
						<Button outline type="button" onClick={resetForm}>
							{t("manuals_page.reset")}
						</Button>
						<Button type="submit" disabled={isDisabled}>
							{t("manuals_page.send")}
						</Button>
					</div>
				</div>

				<div className="flex flex-[1] justify-center">
					<div className="w-[360px]">
						<SMSReview
							channel={formik.values.channel}
							branchName={brandOptions.find((b) => b.value === formik.values.brand)?.label || ""}
							messageContent={sampleContent}
							phoneNumber={"+84123456789"}
						/>
					</div>
				</div>
			</form>
		</DefaultPageLayout>
	);
};

export default ManualPage;
