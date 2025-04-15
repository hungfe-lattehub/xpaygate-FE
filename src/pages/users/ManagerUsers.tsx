import {
	DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
	ColumnDef,
} from "@tanstack/react-table"

import {Button} from "@/components/ui/button.tsx"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel, DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"

import {DataTable} from "@/components/DataTable.tsx";
import {deleteUser, getUsers} from "@/service/User.tsx";
import {AUTHORITIES} from "@/service/utils.tsx";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx"
import {ListLink, NavTemplate} from "@/components/NavTemplate.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {DialogAssignPayGate} from "@/components/DialogAssignPayGate.tsx";
import {useState} from "react";
import {Toaster} from "@/components/ui/toaster.tsx";
import {toast} from "@/components/ui/use-toast.ts";
import {DialogUpdatePermission} from "@/components/DialogUpdatePermission.tsx";


export type User = {
	id: string
	fullName: string
	authorities: string[]
	paygateIDs: string[]
	email: string
}


function ManagerUsers() {
	const columns: ColumnDef<User>[] = [
		{
			accessorKey: "email",
			header: "Email",
			size: 300,
			enableResizing: true,
			cell: ({row}) => <div>{row.getValue("email")}</div>,
		},
		{
			accessorKey: "fullName",
			header: "Full Name",
			cell: ({row}) => <div>{row.getValue("fullName")}</div>,
		},
		{
			accessorKey: "authorities",
			header: "Permissions",
			cell: ({row}) => (
				<div style={{display: 'flex', flexWrap: 'wrap'}}>
					{(row.getValue("authorities") as string[]).map((authority: string, index: number) => (
						<Badge variant="outline" key={index + "authorities"} style={{marginRight: '10px'}}>{authority}</Badge>
					))}
				</div>
			),
		},
		{
			id: "actions",
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
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem className="text-red-500">
									<AlertDialogTrigger className="w-full text-left">
										Delete
									</AlertDialogTrigger>
								</DropdownMenuItem>
								<DropdownMenuSeparator/>
								<DropdownMenuItem onClick={() => setOpenDialogId(row.original.id)}>Assign User</DropdownMenuItem>
								<DropdownMenuSeparator/>
								<DropdownMenuItem onClick={() => setDialogPermisisonId(row.original.id)}>Change
									Permission</DropdownMenuItem>
							</DropdownMenuContent>
							<DialogAssignPayGate
								isDialogOpen={openDialogId === row.original.id}
								setIsDialogOpen={(isOpen) => {
									if (!isOpen) {
										setOpenDialogId(null);
									}
								}}
								userID={row.original.id}
								userEmail={row.original.email}
								userName={row.original.fullName}
								paygateIDs={row.original.paygateIDs}
							/>
							<DialogUpdatePermission isDialogOpen={openDialogPermisisonId === row.original.id}
							                        setIsDialogOpen={
								                        (isOpen) => {
									                        if (!isOpen) {
										                        setDialogPermisisonId(null);
									                        }
								                        }
							                        }
							                        userID={row.original.id} userEmail={row.original.email}
							                        permission={row.original.authorities}/>
						</DropdownMenu>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete User</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure delete user <b> {row.original.email} ({row.original.fullName})</b>?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={() => {
									deleteHandler(row.original.id)
								}} className="bg-red-500 hover:bg-red-500">Delete</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)
			},
		},
	]
	const deleteHandler = async (userID: string) => {
		deleteUser(userID).then((result) => {
			if (result && result.status === 200) {
				toast({
					title: "Delete User Success",
					description: "User has been deleted successfully!",
				})
			} else {
				toast({
					variant: "destructive",
					title: "Delete User Failed",
					description: result?.data.message,
				})
			}
		});
	}
	const [openDialogId, setOpenDialogId] = useState<string | null>(null);
	const [openDialogPermisisonId, setDialogPermisisonId] = useState<string | null>(null);
	// const [isDialogAssignPayGateOpen, setIsDialogAssignPayGateOpen] = useState(false);
	const fetchData = async (pageSize: number, pageIndex: number) => {
		const result = await getUsers(pageSize, pageIndex);
		if (result)
			result.data.content = result.data.content.map((user: User) => {
				user.authorities = user.authorities.map((authority: string) => {
					const authorityObject = AUTHORITIES.find((auth) => auth.value.includes(authority));
					return authorityObject ? authorityObject.name : authority;
				}).filter((value, index, self) => self.indexOf(value) === index);
				return user;
			});
		return result;
	};
	const listLink: ListLink[] = [
		{href: "/managerusers", text: "List Users", primary: true},
		{href: "/createuser", text: "Create new user"},
	]
	return (
		<NavTemplate listLinks={listLink} title={'Manager Users'}>
			<DataTable columns={columns} reloadData={fetchData}/>
			<Toaster/>
		</NavTemplate>
	)
}

export default ManagerUsers;