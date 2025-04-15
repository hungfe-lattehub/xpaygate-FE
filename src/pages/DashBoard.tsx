import {ColumnDef} from "@tanstack/react-table";
import {fecthTransactionList} from "@/service/TransactionService.tsx";
import {DataTableTransaction} from "@/components/DataTableTransaction.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {QueryTransactionType} from "@/type/QueryTransactionType.tsx";

interface Transaction {
	id: string;
	payGateId: number;
	payGateName: string;
	payGateType: string;
	type: string;
	typeDescription: string;
	note: string | null;
	createdAt: string;
	updatedAt: string | null;
	amount: string;
	fee: string;
	shippingFee: string | null;
	currency: string;
	status: string;
	description: string;
}

function getFirstThreeWords(str: string) {
	if (!str) {
		return '';
	}
	const words = str.split(' ');
	if (words.length < 3) {
		return str;
	}
	const firstThreeWords = words.slice(0, 3);
	firstThreeWords.push('...');
	return firstThreeWords.join(' ');
}

const transactionColumns: ColumnDef<Transaction>[] = [
	{
		accessorKey: "payGateType",
		header: "PayGate Type",
		size: 120, // Custom size in pixels
		cell: ({row}) => <div>{row.getValue("payGateType")}</div>,
	},
	{
		accessorKey: "payGateName",
		header: "PayGate Name",
		size: 120,
		cell: ({row}) => <div>{row.getValue("payGateName")}</div>,
	},
	{
		accessorKey: "createdAt",
		header: "Time",
		size: 200, // Custom size in pixels
		cell: ({row}) => <div>{row.getValue("createdAt")}</div>,
	},
	{
		accessorKey: "id",
		header: "Transaction ID",
		size: 150,
		cell: ({row}) => <div>{row.getValue("id")}</div>,
	},
	{
		accessorKey: "typeDescription",
		header: "Transaction Type",
		size: 150, // Custom size in pixels
		cell: ({row}) => {
			const type = row.original.type
			return (row.getValue('typeDescription') || type
			);
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		size: 300,
		cell: ({row}) => {
			return (
				<TooltipProvider delayDuration={10}>
					<Tooltip>
						<TooltipTrigger>{getFirstThreeWords(row.getValue('description'))}</TooltipTrigger>
						<TooltipContent>
							<p>{row.getValue('description')}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			
			);
		},
	},
	{
		accessorKey: "currency",
		header: "Currency",
		size: 10, // Custom size in pixels
		cell: ({row}) => <div>{row.getValue("currency")}</div>,
	},
	{
		accessorKey: "amount",
		header: "Amount",
		size: 120, // Custom size in pixels
		cell: ({row}) => <div>{row.getValue("amount")}</div>,
	},
	{
		accessorKey: "fee",
		header: "Fee",
		size: 120, // Custom size in pixels
		cell: ({row}) => <div>{row.getValue("fee")}</div>,
	},
	{
		accessorKey: "netAmount",
		header: "Net",
		size: 150, // Custom size in pixels
		cell: ({row}) => {
			const netAmount = parseFloat(row.getValue("netAmount"));
			const badgeClass = netAmount > 0 ? "bg-green-600" : "bg-red-500";
			return <Badge className={badgeClass}>{row.getValue("netAmount")}</Badge>;
		},
	},
	{
		accessorKey: "customerEmail",
		header: "Customer Email",
		size: 150, // Custom size in pixels
		cell: ({row}) => <div>{row.getValue("customerEmail")}</div>,
	},
	{
		accessorKey: "source",
		header: "Source",
		size: 150, // Custom size in pixels
		cell: ({row}) => <div>{row.getValue("source")}</div>,
	},
];

export function Dashboard() {
	const fetchData = async (query: QueryTransactionType) => {
		return await fecthTransactionList(query);
	}
	return (
		<div className="max-w-[95%] mx-auto">
			<DataTableTransaction columns={transactionColumns} reloadData={fetchData}/>
		</div>
	)
}