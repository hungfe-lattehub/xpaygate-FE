import {ListLink, NavTemplate} from "@/components/NavTemplate.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {deleteConfigPayoutById, getAllConfigPayout} from "@/service/ConfigPayout.tsx";
import {ConfigPayoutType} from "@/type/ConfigPayoutType.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {DataTable} from "@/components/DataTable.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CaretSortIcon, DotsHorizontalIcon} from "@radix-ui/react-icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useNavigate} from "react-router-dom";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription, AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {toast} from "@/components/ui/use-toast";
import {useState} from "react";

const listLink: ListLink[] = [
	{href: "/payout", text: "Manage Payout", primary: true},
	{href: "/payout/config", text: "Config Payout",},
	{href: "/payout/history", text: "History",},
	{href: "/payout/send", text: "Payout Now"},

]

export function ManagePayout() {
	const [reloadKey, setReloadKey] = useState(0);
	const fetchData = async (pageSize: number, pageIndex: number) => {
		return await getAllConfigPayout(pageSize, pageIndex);
	}
	const deleteConfigPayout = (payGateId: string) => {
		deleteConfigPayoutById(payGateId).then((response) => {
			if (response && response.status === 200) {
				toast({
					title: "Success",
					description: "Config Payout has been delete successfully",
				});
				setReloadKey(prevKey => prevKey + 1);
			} else {
				toast({
					variant: "destructive",
					title: "Failed",
					description: "Failed to delete Config Payout",
				});
			}
		});
	}
	const navigate = useNavigate();
	const columns: ColumnDef<ConfigPayoutType>[] = [
		{
			accessorKey: "payGateName",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("payGateName")}</div>,
		},
		{
			accessorKey: "note",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Note
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("note")}</div>,
		},
		{
			accessorKey: "emailSubject",
			header: "Email Subject",
			enableSorting: true,
			cell: ({row}) => <div>{row.getValue("emailSubject")}</div>,
		},
		{
			accessorKey: "emailMessage",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Email Message
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("emailMessage")}</div>,
		},
		{
			accessorKey: "threshold",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Threshold
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("threshold")} USD</div>,
		},
		{
			accessorKey: "configEmails",
			header: "List Emails",
			size: 800,
			cell: ({row}) => {
				const configPayoutType = row.original;
				return (
					<div>
						{(row.getValue("configEmails") as ConfigPayoutType['configEmails']).map((configemail, index) => (
							<div key={index}>
								{configemail.email} - {configemail.percent}% -
								({Number(configemail.percent) * Number(configPayoutType.threshold) / 100} USD)<br/>
							</div>
						))}
					</div>
				)
			},
		},
		{
			id: "actions",
			header: "Actions",
			enableHiding: false,
			cell: ({row}) => {
				return (
					<AlertDialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<DotsHorizontalIcon className="h-4 w-4"/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => {
									navigate(`/payout/config?payGateId=${row.original.payGateId}`);
								}}>
									Update
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-500" onClick={() => {
								}}>
									<AlertDialogTrigger className="w-full text-left">
										Delete
									</AlertDialogTrigger>
								</DropdownMenuItem>
							</DropdownMenuContent>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete Payout Config</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure delete config of this payment gate <b> {row.original.payGateName} </b>?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={() => {
										deleteConfigPayout(row.original.payGateId)
									}} className="bg-red-500 hover:bg-red-500">Delete</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</DropdownMenu>
					</AlertDialog>
				)
			}
		}
	]
	return (
		<NavTemplate listLinks={listLink} title={'Payout'}>
			<DataTable columns={columns} reloadData={fetchData} reloadKey={reloadKey}/>
			<Toaster/>
		</NavTemplate>
	);
}