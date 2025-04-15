import {ListLink, NavTemplate} from "@/components/NavTemplate.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {getAllHistoryPayout} from "@/service/ConfigPayout.tsx";
import {DataTable} from "@/components/DataTable.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {CaretSortIcon, DotsHorizontalIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button";
import {HistoryPayoutType, PayoutItemType} from "@/type/HistoryPayoutType.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {Send} from "lucide-react";
import {format} from "date-fns";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useState} from "react";
import {DialogUpdateHistoryPayout} from "@/components/DialogUpdateHistoryPayout.tsx";

const listLink: ListLink[] = [
	{href: "/payout", text: "Manage Payout"},
	{href: "/payout/config", text: "Config Payout",},
	{href: "/payout/history", text: "History", primary: true},
	{href: "/payout/send", text: "Payout Now"},
]
export const HistoryPayout = () => {
	const fetchData = async (pageSize: number, pageIndex: number) => {
		return await getAllHistoryPayout(pageSize, pageIndex);
	}
	const [openDialogId, setOpenDialogId] = useState<string | null>(null);
	const [reloadKey, setReloadKey] = useState(0);
	
	const columns: ColumnDef<HistoryPayoutType>[] = [
		{
			accessorKey: "payoutId",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Payout ID
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("payoutId")}</div>,
		},
		{
			accessorKey: "payGateName",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					PayGate Name
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("payGateName")}</div>,
		},
		{
			accessorKey: "payoutDate",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Payout Date
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{format((row.getValue("payoutDate")), 'yyyy-MM-dd hh:mm')}</div>,
		},
		{
			accessorKey: "status",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("status")}</div>,
		},
		{
			accessorKey: "payoutItems",
			header: "Payout Items",
			cell: ({row}) => (
				<div>
					{(row.getValue("payoutItems") as PayoutItemType[]).map((item, index) => (
						<Alert key={index}>
							<Send className="h-4 w-4"/>
							<AlertTitle>{format((item.createdAt), 'yyyy-MM-dd hh:mm')}</AlertTitle>
							<AlertDescription>
								{item.email} - {item.amount} {item.currency}
							</AlertDescription>
						</Alert>
					))}
				</div>
			),
		},
		{
			accessorKey: "error",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Error
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			size: 200,
			cell: ({row}) => <div>
				<TooltipProvider delayDuration={10}>
					<Tooltip>
						<TooltipTrigger>{getFirstTwentyCharacters(row.getValue('error'))}</TooltipTrigger>
						<TooltipContent>
							<p>{row.getValue('error')}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>,
		},
		{
			accessorKey: "note",
			header: "Note",
			cell: ({row}) => (
				<div>
					<p>{row.getValue('note')}</p>
				</div>
			),
		},
		{
			id: "actions",
			header: "Actions",
			enableHiding: false,
			cell: ({row}) => {
				const historyPayoutType = row.original
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<DotsHorizontalIcon className="h-4 w-4"/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => {
								setOpenDialogId(row.original.id.toString());
							}}>
								Update
							</DropdownMenuItem>
						</DropdownMenuContent>
						<DialogUpdateHistoryPayout isDialogOpen={openDialogId === historyPayoutType.id.toString()}
						                           historyNote={historyPayoutType.note} historyID={historyPayoutType.id.toString()}
						                           setIsDialogOpen={(isOpen) => {
							                           if (!isOpen) {
								                           setOpenDialogId(null);
							                           }
						                           }} setReloadKey={setReloadKey}></DialogUpdateHistoryPayout>
					</DropdownMenu>
				)
			}
		}
	];
	
	function getFirstTwentyCharacters(str: string) {
		if (!str) {
			return '';
		}
		if (str.length <= 50) {
			return str;
		}
		return str.slice(0, 50) + '...';
	}
	
	return (
		<NavTemplate listLinks={listLink} title={'Payout'}>
			<div className="max-w-[100%] mx-auto">
				<DataTable columns={columns} reloadData={fetchData} reloadKey={reloadKey}/>
			</div>
			<Toaster/>
		</NavTemplate>
	);
}