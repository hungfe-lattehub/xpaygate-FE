import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {CaretSortIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {useState} from "react";
import {getAllRefund} from "@/service/Refund.tsx";
import {CreateRefund} from "@/pages/refund/CreateRefund.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {DataTableRefund} from "@/components/DataTableRefund.tsx";
import {QueryRefundType} from "@/type/QueryRefundType.tsx";
import {CreateRefundWithOutCheck} from "@/pages/refund/CreateRefundWithOutCheck.tsx";

interface Refund {
	id: number;
	payGateName: string;
	transactId: string;
	amount: number;
	reason: string;
	status: string;
	createDate: string;
	result: string;
	user: string;
}

export function Refund() {
	const columns: ColumnDef<Refund>[] = [
		{
			accessorKey: "payGateName",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Payment Gateway
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			size: 300,
			enableResizing: true,
			cell: ({row}) => <div>{row.getValue("payGateName")}</div>,
		},
		{
			accessorKey: "transactionId",
			header: "Transaction ID",
			cell: ({row}) => <div>{row.getValue("transactionId")}</div>,
		},
		{
			accessorKey: "amount",
			header: "Amount",
			cell: ({row}) => <div>{row.getValue("amount")}</div>,
		},
		{
			accessorKey: "reason",
			header: "Reason",
			cell: ({row}) => <div>{row.getValue("reason")}</div>,
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({row}) => <div>{row.getValue("status")}</div>,
		},
		{
			accessorKey: "createdAt",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Create Date
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => {
				const createdAt = row.getValue("createdAt") as number;
				const date = new Date(createdAt * (createdAt < 10000000000 ? 1000 : 1));
				return <div>{format(date, 'hh:mm dd-MM-yyyy')}</div>;
			},
		},
		{
			accessorKey: "result",
			header: "Result",
			cell: ({row}) => <div>{row.getValue("result")}</div>,
		},
		{
			accessorKey: "userAction",
			header: "User",
			cell: ({row}) => <div>{row.getValue("userAction")}</div>,
		},
	];
	const [reloadKey, setReloadKey] = useState(0)
	
	const fetchData = async (query: QueryRefundType) => {
		return await getAllRefund(query);
	};
	
	const [isOpen, setIsOpen] = useState(false)
	const [isOpen2, setIsOpen2] = useState(false)
	
	return (
		<div className="mx-20 mt-5">
			<div className="flex justify-between">
				<div className="space-x-2">
					<Button className="bg-sky-500 hover:bg-sky-500" onClick={() => {
						setIsOpen(true)
					}}>Create Refund</Button>
					<Button className="bg-sky-500 hover:bg-sky-500" onClick={() => {
						setIsOpen2(true)
					}}>Create Refund Without Check</Button>
				</div>
			</div>
			<DataTableRefund columns={columns} reloadData={fetchData} reloadKey={reloadKey}/>
			<CreateRefund isDialogOpen={isOpen} setIsDialogOpen={setIsOpen} onResponse={setReloadKey}/>
			<CreateRefundWithOutCheck isDialogOpen={isOpen2} setIsDialogOpen={setIsOpen2} onResponse={setReloadKey}/>
			<Toaster/>
		</div>
	);
}
