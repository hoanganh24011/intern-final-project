"use client";

import React, { useCallback } from "react";
import InputForm from "@/src/components/shared/molecules/InputForm";
import { AlignJustify, CirclePlus, PlusCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "react-day-picker";

export interface RowData {
	id: string;
	list_param: Record<string, string>;
	phone_number: string;
}

export interface ReceiverTableProps {
	params: string[];
	rows: RowData[];
	setRows: (rows: RowData[]) => void;
}

const ReceiverTable = ({ params, rows, setRows }: ReceiverTableProps) => {
	const t = useTranslations();

	const handlePhoneChange = useCallback(
		(index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const newRows = [...rows];
			newRows[index].phone_number = event.target.value;
			setRows(newRows);
		},
		[rows]
	);

	/**
	 * HandleListParamChange
	 * @param event  React.ChangeEvent<HTMLInputElement>
	 */
	const handleListParamChange = useCallback(
		(index: number, param: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const newRows = [...rows];
			newRows[index].list_param[param] = event.target.value;
			setRows(newRows);
		},
		[rows]
	);

	/**
	 * Remove Row
	 */
	const removeRow = useCallback((index: number) => {
		const newRows = rows.filter((_, i) => i !== index);
		setRows(newRows);
	}, []);

	/**
	 * Add Row
	 */
	const addRow = useCallback(() => {
		const newRow: RowData = {
			id: crypto.randomUUID(),
			list_param: params.reduce((acc, param) => ({ ...acc, [param]: "" }), {}),
			phone_number: "",
		};
		setRows([...rows, newRow]);
	}, [params, rows, setRows]);

	return (
		<div className="flex flex-col gap-2">
			{/* Area: Title */}
			<div className="font-inter text-base font-semibold text-gray-900 dark:text-white">
				{t("sending_manuals_page.receiver_information")} <span className="text-red-500">*</span>
			</div>

			{/* Table Header */}
			<table className="w-full border-collapse text-sm text-gray-600 dark:text-gray-100">
				<thead className="text-gray-500 dark:text-gray-100">
					<tr className="text-center font-inter text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-100">
						<th className="whitespace-nowrap border-b border-r border-gray-300 p-2 text-center">
							phone_number
						</th>

						{/* Dynamically Generate Headers for List Parameters */}
						{params.map((param) => (
							<th key={param} className="border-r border-gray-300 p-2 text-center">
								{param}
							</th>
						))}

						<th>
							<AlignJustify strokeWidth={2.5} size={16} className="mx-auto" />
						</th>
					</tr>
				</thead>

				<tbody>
					{/* Render Rows Dynamically */}
					{rows.map((row, index) => (
						<tr key={`${index}-${row.id}`} className="border-b">
							{/* Phone Number Input */}
							<td className="border-r border-gray-300">
								<InputForm
									id="phone"
									required
									type="text"
									value={row.phone_number}
									placeholder={t("input.placeholder", {
										data: "phone_number",
									})}
									className="w-full rounded p-0 text-center font-inter text-sm font-normal leading-[22px] focus:ring-1 focus:ring-blue-500"
									onChange={handlePhoneChange(index)}
								/>
							</td>

							{/* List Parameter Inputs */}
							{params.map((param, paramIndex) => (
								<td key={param} className="border border-gray-300">
									<InputForm
										id="param"
										required
										value={row.list_param[param] || ""}
										placeholder={t("input.placeholder", {
											data: params[paramIndex],
										})}
										className="w-full rounded p-0 text-center font-inter text-sm font-normal leading-[22px] focus:ring-1 focus:ring-blue-500"
										onChange={handleListParamChange(index, param)}
									/>
								</td>
							))}
							{/* Remove Row Button */}
							<td className="relative border-b border-l border-t border-gray-300">
								<div className="flex justify-center">
									<Button
										disabled={rows.length <= 1}
										type="button"
										className="m-1 min-w-8"
										onClick={() => removeRow(index)}
									>
										<Trash2 strokeWidth={2.5} size={16} />
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="w-4/12">
				{/* Area: Add Row Button */}
				<Button
					type="button"
					className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700"
					onClick={addRow}
				>
					<PlusCircle size={16} strokeWidth={2} />
					{t("sending_manuals_page.add_receiver")}
				</Button>
			</div>
		</div>
	);
};

export default ReceiverTable;
