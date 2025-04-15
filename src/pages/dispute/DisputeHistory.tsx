import {DataTable} from "@/components/DataTable.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {CaretSortIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {downloadDisputeExport, getDisputeExportHistory} from "@/service/Dispute.tsx";

interface DisputeHistory {
	id: number;
	fileName: string;
	createdAt: string;
	createdBy: string;
	downloadUrl: string | null;
}

export function DisputeHistory() {
	const columns: ColumnDef<DisputeHistory>[] = [
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
			cell: ({row}) => <div>{row.getValue("fileName")}</div>,
		},
		{
			accessorKey: "createdAt",
			header: ({column}) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Created At
					<CaretSortIcon className="ml-2 h-4 w-4"/>
				</Button>
			),
			cell: ({row}) => <div>{format(new Date(row.getValue("createdAt")), 'hh:mm dd-MM-yyyy')}</div>,
		},
		{
			accessorKey: "createdBy",
			header: "Created By",
			enableSorting: true,
			cell: ({row}) => <div>{row.getValue("createdBy")}</div>,
		},
		{
			accessorKey: "downloadUrl",
			header: "Download",
			enableSorting: false,
			cell: ({row}) => {
				const url = row.getValue("downloadUrl");
				return url ? (
					<Button onClick={()=>{
						downloadByUrl(url.toString());
					}}>
						Download
					</Button>
				) : (
					<span>No File</span>
				);
			},
		},
	];
	const downloadByUrl = (url: string) => {
		downloadDisputeExport(url);
	}
	const fetchDisputeHistory = async (pagesize: number, pageindex: number) => {
		return await getDisputeExportHistory(pagesize, pageindex);
	}
	return (
		<div className="mx-20 mt-5">
			<h2 className="text-xl font-bold mb-4">Dispute Export History</h2>
			<DataTable columns={columns} reloadData={fetchDisputeHistory}/>
		</div>
	);
}

