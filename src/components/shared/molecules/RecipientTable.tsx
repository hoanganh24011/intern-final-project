import { Recipient } from "@type/component/recipient";
import { FC } from "react";

interface RecipientTableProps {
	recipients: Recipient[];
	getRowError: (r: Recipient) => { phone: string; otp: string; number: string };
	handleInputChange: (idx: number, field: keyof Recipient, value: string) => void;
	handleRemove: (idx: number) => void;
}

export const RecipientTable: FC<RecipientTableProps> = ({
	recipients,
	getRowError,
	handleInputChange,
	handleRemove,
}) => (
	<table className="mb-2 w-full border">
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
								className={`w-full rounded border px-2 py-1 ${rowErr.phone ? "border-red-400" : ""}`}
								value={r.phone}
								onChange={(e) => handleInputChange(idx, "phone", e.target.value)}
							/>
							{rowErr.phone && <div className="text-xs text-red-500">{rowErr.phone}</div>}
						</td>
						<td className="border px-2 py-1">
							<input
								className={`w-full rounded border px-2 py-1 ${rowErr.otp ? "border-red-400" : ""}`}
								value={r.otp}
								onChange={(e) => handleInputChange(idx, "otp", e.target.value)}
							/>
							{rowErr.otp && <div className="text-xs text-red-500">{rowErr.otp}</div>}
						</td>
						<td className="border px-2 py-1">
							<input
								type="number"
								min={1}
								className={`w-full rounded border px-2 py-1 ${rowErr.number ? "border-red-400" : ""}`}
								value={r.number}
								onChange={(e) => handleInputChange(idx, "number", e.target.value)}
							/>
							{rowErr.number && <div className="text-xs text-red-500">{rowErr.number}</div>}
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
	</table>
);
