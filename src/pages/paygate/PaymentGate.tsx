import {ListLink, NavTemplate} from "@/components/NavTemplate";
import {ColumnDef} from "@tanstack/react-table";
import {deletePaymentGate, getPaymentGateList} from "@/service/PaymentGate.tsx";
import {DataTable} from "@/components/DataTable.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CaretSortIcon, DotsHorizontalIcon} from "@radix-ui/react-icons";
import {Paygate} from "@/type/Paygate.tsx";
import {useState} from "react";
import {DialogUpdatePayGate} from "@/components/DialogUpdatePayGate.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {useAuth} from "@/components/AuthProvider.tsx";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription, AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {toast} from "@/components/ui/use-toast.ts";
import {formatNumber} from "@/service/utils.tsx";


export default function PaymentGate() {
	const {isAdmin} = useAuth();
	const fetchData = async (pageSize: number, pageIndex: number) => {
		return await getPaymentGateList(pageSize, pageIndex);
	}
	const [reloadKey, setReloadKey] = useState(0);
	
	const columns: ColumnDef<Paygate>[] = [
		
		{
			accessorKey: "domain",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Domain
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			size: 300,
			enableResizing: true,
			cell: ({row}) => <div>{row.getValue("domain")}</div>,
		},
		{
			accessorKey: "name",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("name")}</div>,
		},
		{
			accessorKey: "type",
			header: "Type",
			enableSorting: true,
			cell: ({row}) => <div>{row.getValue("type")}</div>,
		},
		{
			accessorKey: "groupName",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Group Name
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("groupName")}</div>,
		},
		{
			accessorKey: "balances",
			header: "Balances",
			size: 800,
			cell: ({row}) => (
				<div>
					{row.original.balanceRealtime && row.original.balanceRealtime.replace(/[{}]/g, '') && <div>
              <Badge
                  className="bg-sky-700 my-1">  {row.original.balanceRealtime.replace(/[{}]/g, '')}</Badge>
          </div>}
					{(row.getValue("balances") as Paygate['balances']).map((balance, index) => (
						(balance.available_balance > 0 || balance.hold_balance > 0) &&
            <div key={index}>
                <Badge
                    className="bg-green-700 my-1">Avail: {formatNumber(balance.available_balance)} {balance.id.currency.toUpperCase()}</Badge>
							{balance.hold_balance > 0 &&
                  <Badge variant="destructive"
                         className="my-1">Hold: {formatNumber(balance.hold_balance)} {balance.id.currency.toUpperCase()}</Badge>}
            </div>
					))}
				</div>
			),
		},
		{
			accessorKey: "holdStatus",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Hold Status
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			size: 300,
			enableResizing: true,
			cell: ({row}) => <div>{row.getValue("holdStatus")}</div>,
		},
		{
			accessorKey: "limitStatus",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Limit Status
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			size: 300,
			enableResizing: true,
			cell: ({row}) => <div>{row.getValue("limitStatus")}</div>,
		},
		{
			accessorKey: "email",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Email
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{row.getValue("email")}</div>,
		},
		{
			id: "actions",
			header: "Actions",
			enableHiding: false,
			cell: ({row}) => {
				const paygate = row.original
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
									setOpenDialogId(row.original.id.toString());
								}}>
									Update
								</DropdownMenuItem>
								{isAdmin() &&
                    <DropdownMenuItem className="text-red-500">
                        <AlertDialogTrigger className="w-full text-left">
                            Delete
                        </AlertDialogTrigger>
                    </DropdownMenuItem>}
							</DropdownMenuContent>
							<DialogUpdatePayGate payGate={paygate} isDialogOpen={openDialogId === paygate.id.toString()}
							                     setIsDialogOpen={(isOpen) => {
								                     if (!isOpen) {
									                     setOpenDialogId(null);
								                     }
							                     }} setReloadKey={setReloadKey}></DialogUpdatePayGate>
						</DropdownMenu>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Payment Gate</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure delete Payment Gate (disputes, transactions,..) <b> {row.original.name}</b>?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={() => {
									handleDelete(row.original.id.toString());
								}} className="bg-red-500 hover:bg-red-500">Delete</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)
			}
		}
	]
	const [openDialogId, setOpenDialogId] = useState<string | null>(null);
	const handleDelete = async (id: string) => {
		const res = await deletePaymentGate(id);
		if (res && res.status === 200) {
			setReloadKey(reloadKey + 1);
		} else {
			toast({
				variant: "destructive",
				title: "Delete Payment Gate Failed",
				description: res?.data.message,
			})
		}
	}
	const listLink: ListLink[] = [
		{href: "/paymentgate", text: "List Payment Gate", primary: true},
		{href: "/addpaymentgate", text: "Add Payment Gate",},
	]
	return (<NavTemplate listLinks={listLink} title={'Payment Gate'}>
		<DataTable columns={columns} reloadData={fetchData} reloadKey={reloadKey}/>
		<Toaster/>
	</NavTemplate>)
}