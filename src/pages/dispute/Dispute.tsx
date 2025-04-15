import {ColumnDef} from "@tanstack/react-table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {fetchDisputeList} from "@/service/Dispute.tsx";
import {QueryTransactionType} from "@/type/QueryTransactionType.tsx";
import {DataTableDispute} from "@/components/DataTableDispute.tsx";
import {Link} from 'react-router-dom';
import {Badge} from "@/components/ui/badge.tsx";

interface Dispute {
	id: string;
	payGateName: string;
	payGateType: string;
	transactionId: string;
	transactionDescription: string;
	createdAt: string;
	status: string;
	reason: string;
	amount: string;
	currency: string;
	responseDeadline: string | null;
	result?: string;
}

function remainTime(deadline: string): string {
	if (!deadline) {
		return ''
	}
	const [datePart, timePartWithPeriod] = deadline.split(' ');
	const [timePart, period] = timePartWithPeriod.split(' ');
	const [month, day, year] = datePart.split('/');
	let [hour, minute] = timePart.split(':').map(Number);
	
	// Adjust hour for AM/PM
	if (period === 'PM' && hour !== 12) {
		hour += 12;
	} else if (period === 'AM' && hour === 12) {
		hour = 0;
	}
	
	const deadlineDate = new Date(Number(year), Number(month) - 1, Number(day), hour, minute);
	
	// Get the current time in GMT-7
	const now = new Date();
	const offset = now.getTimezoneOffset() * 60000; // offset in milliseconds
	const currentTimeGMTMinus7 = new Date(now.getTime() + offset - (7 * 60 * 60000));
	
	// Calculate the remaining time
	const remainingTime = deadlineDate.getTime() - currentTimeGMTMinus7.getTime();
	
	
	if (remainingTime > 0) {
		const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
		const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		
		return `Response in ${days} days, ${hours} hours`;
	} else {
		return `Overdue`;
	}
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

function formatStatus(status: string): string {
	if (!status) {
		return ''
	}
	return status
		.split('_')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

const disputeColumns: ColumnDef<Dispute>[] = [
	{
		accessorKey: "createdAt",
		header: "Created At",
		size: 120,
		cell: ({row}) => <div>{row.getValue("createdAt")}</div>,
	},
	{
		accessorKey: "responseDeadline",
		header: "Response Deadline",
		size: 120,
		cell: ({row}) => <div>{row.getValue("responseDeadline")}</div>,
	},
	{
		accessorKey: "payGateName",
		header: "PayGate Name",
		size: 120,
		cell: ({row}) => <div>{row.getValue("payGateName")}</div>,
	},
	{
		accessorKey: "type",
		header: "Type",
		size: 120,
		cell: ({row}) => <div>{row.getValue("type")}</div>,
	},
	{
		accessorKey: "id",
		header: "Case ID",
		size: 200,
		cell: ({row}) => {
			const id = row.original.id;
			const payGateType = row.original.payGateType;
			const responseDeadline = row.original.responseDeadline;
			const getLink = () => {
				switch (payGateType) {
					case 'PAYPAL':
						return (
							<div className="flex flex-col">
								{responseDeadline && <Badge
                    className="bg-red-400 hover:bg-red-700 whitespace-nowrap">{remainTime(responseDeadline)}</Badge>}
								<Link className="underline decoration-sky-500" target='_blank' to={`/dispute/paypal/${id}`}>
									{id}
								</Link>
							</div>
						);
					case 'STRIPE':
						return (
							<div className="flex flex-col">
								{responseDeadline && <Badge
                    className="bg-red-400 hover:bg-red-700 whitespace-nowrap">{remainTime(responseDeadline)}</Badge>}
								<Link className="underline decoration-sky-500" target='_blank' to={`/dispute/stripe/${id}`}>
									{id}
								</Link>
							</div>
						);
					default:
						return <div>{id}</div>;
				}
			};
			
			return <div>{getLink()}</div>;
		}
	},
	{
		accessorKey: "transactionId",
		header: "Original Transaction ID",
		size: 150,
		cell: ({row}) => <div>{row.getValue("transactionId")}</div>,
	}
	,
	{
		accessorKey: "transactionCreatedAt",
		header: "Transaction date",
		size: 150,
		cell: ({row}) => <div>{row.getValue("transactionCreatedAt")}</div>,
	},
	{
		accessorKey: "transactionDescription",
		header: "Transaction Description",
		size: 150,
		cell: ({row}) => {
			return (
				<TooltipProvider delayDuration={10}>
					<Tooltip>
						<TooltipTrigger>{getFirstThreeWords(row.getValue('transactionDescription'))}</TooltipTrigger>
						<TooltipContent>
							<p>{row.getValue('transactionDescription')}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	
	{
		accessorKey: "status",
		header: "Status",
		size: 120,
		cell: ({row}) => {
			const result = row.original.result;
			const status =row.original.status;
			return (
				<div className="flex flex-col">
					<div>{formatStatus(row.getValue("status"))}</div>
					{status === 'RESOLVED' && (
						<Badge className={`mt-2 ${result === "WON" ? "bg-green-500" : "bg-red-500"} text-center w-full`}>
							{result}
						</Badge>
					)}
				</div>
			)
		},
	},
	{
		accessorKey: "reason",
		header: "Reason",
		size: 120,
		cell: ({row}) => <div>{formatStatus(row.getValue("reason"))}</div>,
	},
	{
		accessorKey: "customerEmail",
		header: "Customer Email",
		size: 120,
		cell: ({row}) => <div>{formatStatus(row.getValue("customerEmail"))}</div>,
	},
	{
		accessorKey: "amount",
		header: "Amount",
		size: 100,
		cell: ({row}) => <div>{row.getValue("amount") + ' '}</div>,
	},
];

export function Dispute() {
	const fetchData = async (query: QueryTransactionType) => {
		return await fetchDisputeList(query);
	}
	
	return (
		<div className="max-w-[95%] mx-auto">
			<DataTableDispute columns={disputeColumns} reloadData={fetchData}/>
		</div>
	);
}