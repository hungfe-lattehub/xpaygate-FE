import {useEffect, useState} from "react";
import {getReport} from "@/service/Report.tsx";
import {DatePickerWithRange} from "@/components/DatePickerWithRange.tsx";
import {DateRange} from "react-day-picker";
import {getPaymentGateList} from "@/service/PaymentGate.tsx";
import {ComboboxSingleSelect} from "@/components/ComboBoxSingleSelect.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export function Report() {
	const [data, setData] = useState([]);
	const [total, setTotal] = useState({gross: 0, fee: 0, net: 0});
	const [payGateList, setPayGateList] = useState([]);
	const [payGateSelected, setPayGateSelected] = useState<string>();
	const [revenue, setRevenue] = useState('0')
	const [refund, setRefund] = useState('0')
	const [dispute, setDispute] = useState('0')
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: new Date(),
		to: new Date(),
	});
	const order = [
		"Express Checkout Payment",
		"Payment Refund",
		"Hold on Balance for Dispute Investigation",
		"Cancellation of Hold for Dispute Resolution",
		"Chargeback",
		"Chargeback Reversal",
		"Payment Reversal",
		"Dispute Fee",
		"Reserve Hold",
		"Reserve Release"
	];
	useEffect(() => {
		getPaymentGateList(500, 0).then((res) => {
			if (res && res.status === 200) {
				setPayGateList(res.data.content.map((item: any) => {
					return {value: item.id, label: item.name};
				}));
			}
		});
	}, []);
	useEffect(() => {
		if (dateRange?.from && dateRange?.to) {
			onDateRangeChange(dateRange);
			getReport({
				dateRange: dateRange,
				paygateID: payGateSelected
			}).then(result => {
				if (result) {
					setRevenue('0');
					setRefund('0');
					const sorted = result.data.report.sort((a: any, b: any) => {
						const indexA = order.indexOf(a.typeName);
						const indexB = order.indexOf(b.typeName);
						if (indexA === -1) return 1; // If a.typeName is not in the order, move it to the end
						if (indexB === -1) return -1; // If b.typeName is not in the order, move it to the end
						return indexA - indexB;
					});
					setData(sorted);
					setTotal(calculateTotals(result.data.report));
					processReportData(result.data.report);
					setDispute(result.data.dispute);
				}
			});
		}
	}, [dateRange, payGateSelected]);
	const onValueChange = async (value: string) => {
		setPayGateSelected(value);
	};
	const formatNumber = (num: number) => num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const calculateTotals = (data: any) => {
		return data.reduce(
			(totals: any, item: any) => {
				totals.gross += item.debit + item.credit;
				totals.fee += item.debitFee + item.creditFee;
				totals.net += item.credit + item.debit + item.debitFee + item.creditFee;
				return totals;
			},
			{gross: 0, fee: 0, net: 0}
		);
	};
	const processReportData = async (data: any[]) => {
		let totalRevenue = 0;
		let totalRefund = 0;
		for (const item of data) {
			if (item.typeCode === 'charge' || item.typeCode === 'T0006') {
				if (item.currency === 'USD') {
					totalRevenue += item.credit;
				}
			}
			if (item.typeCode === 'refund' || item.typeCode === 'T1107') {
				if (item.currency === 'USD') {
					totalRefund += item.debit;
				}
			}
		}
		setRefund(formatNumber(totalRefund));
		setRevenue(formatNumber(totalRevenue));
	};
	
	const onDateRangeChange = (dateRange: DateRange | undefined) => {
		setDateRange(dateRange);
	}
	return (
		<div className="max-w-[95%] mx-auto">
			<div className="flex justify-between">
				<div className="flex items-center py-4 space-x-4">
					<DatePickerWithRange initValue={dateRange} onValueChange={onDateRangeChange}/>
					<ComboboxSingleSelect data={payGateList} onValueChange={onValueChange} placeholder={'Select payment '}/>
				</div>
			
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Revenue
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${revenue}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Refund
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${refund}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Dispute Created
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dispute}</div>
					</CardContent>
				</Card>
			</div>
			<div className="flex justify-center w-full">
				<div className="overflow-x-auto w-[75%]">
					<table className="bg-white border border-gray-200 w-full">
						<thead>
						<tr className="bg-[#204998] text-white text-left ">
							<th className="py-2 px-4">Type</th>
							<th className="py-2 px-4">Currency</th>
							<th className="py-2 px-4">Gross</th>
							<th className="py-2 px-4">Fee</th>
							<th className="py-2 px-4">Net</th>
						</tr>
						</thead>
						<tbody>
						{data.map((item: any, index: number) => (
							<tr key={index} className="border-t hover:bg-[#2fa1da]">
								<td className="py-2 px-4 ">{item.typeName}</td>
								<td className="py-2 px-4">{item.currency}</td>
								<td className="py-2 px-4">{formatNumber(item.debit + item.credit)}</td>
								<td className="py-2 px-4">{formatNumber(item.debitFee + item.creditFee)}</td>
								<td className="py-2 px-4">{formatNumber(item.credit + item.debit + item.debitFee + item.creditFee)}</td>
							</tr>
						))}
						<tr className="font-bold border-t">
							<td className="py-2 px-4" colSpan={2}>Total</td>
							<td className="py-2 px-4">{formatNumber(total.gross)}</td>
							<td className="py-2 px-4">{formatNumber(total.fee)}</td>
							<td className="py-2 px-4">{formatNumber(total.net)}</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}