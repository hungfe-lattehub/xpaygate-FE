import {DataTable} from "@/components/DataTable.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {CaretSortIcon} from "@radix-ui/react-icons";
import {exportResult, getAllTrackingUpload, uploadExcelFile} from "@/service/TransactionService.tsx";
import {format} from "date-fns";
import {Input} from "@/components/ui/input.tsx";
import {ChangeEvent, useState} from "react";
import {Badge} from "@/components/ui/badge.tsx";

interface Tracking {
	id: number;
	fileName: string;
	createDate: string;
	total: number;
	success: number;
	error: number;
}

export function Tracking() {
	const columns: ColumnDef<Tracking>[] = [
		{
			accessorKey: "fileName",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					File Name
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			size: 300,
			enableResizing: true,
			cell: ({row}) => <div>{row.getValue("fileName")}</div>,
		},
		{
			accessorKey: "createDate",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Create Time
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{format(row.getValue("createDate"), 'hh:mm dd-MM-yyyy')}</div>,
		},
		{
			accessorKey: "total",
			header: "Total",
			enableSorting: true,
			cell: ({row}) => <div>{row.getValue("total")}</div>,
		},
		{
			accessorKey: "success",
			header: "Success",
			enableSorting: true,
			cell: ({row}) => <div>{row.getValue("success")}</div>,
		},
		{
			accessorKey: "error",
			header: "Error",
			enableSorting: true,
			cell: ({row}) => <div>{row.getValue("error")}</div>,
		},
		{
			accessorKey: "status",
			header: "Status",
			enableSorting: true,
			cell: ({row}) => <div>{row.getValue("status")}</div>,
		},
		{
			accessorKey: "resultLink",
			header: "Result",
			enableSorting: true,
			cell: ({row}) => {
				return (
					<div>
						{
							row.getValue("resultLink") !== null &&
                <Button onClick={() => handleDownload( row.getValue("resultLink"))}>Result</Button>}
					</div>)
			},
		},
	];
	const [reloadKey, setReloadKey] = useState(0)
	const fetchData = async (pageSize: number, pageIndex: number) => {
		return await getAllTrackingUpload(pageSize, pageIndex);
	};
	const handleDownload = ( link: string) => {
		exportResult(link);
	}
	const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			uploadExcelFile(file).then(() => setReloadKey(reloadKey + 1)
			);
		}
	};
	return (
		<div className="mx-20 mt-5">
			<div className="flex w-full max-w-sm items-center space-x-2">
				<Badge>Upload</Badge>
				<Input placeholder="Upload tracking" id="upload" type="file" accept=".xlsx,.xls" onChange={handleUpload}/>
			</div>
			<DataTable columns={columns} reloadData={fetchData} reloadKey={reloadKey}/>
		
		</div>
	);
}