import {
	ColumnDef, ColumnFiltersState,
	flexRender,
	getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState,
	useReactTable, VisibilityState,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button.tsx";
import {ReloadIcon} from "@radix-ui/react-icons";
import {ChangeEvent, useEffect, useState} from "react";
import DropdownMenuTemplate from "./DropdownTemplate";
import {Badge} from "./ui/badge";
import {Input} from "@/components/ui/input.tsx";
import {ComboBoxTemplate} from "@/components/ComboBoxTemplate.tsx";
import {getPaymentGateList} from "@/service/PaymentGate.tsx";
import {DatePickerWithRange} from "@/components/DatePickerWithRange.tsx";
import {DateRange} from "react-day-picker";
import {QueryTransactionType} from "@/type/QueryTransactionType.tsx";
import {Download, getDisputeStatus, getDisputeTypes} from "@/service/Dispute.tsx";
import {ComboxBoxItem} from "@/type/ComboxBoxItem.tsx";
import {FileDown, Search} from "lucide-react";
import {formatNumberInteger} from "@/service/utils.tsx";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	reloadData?: any
}

export function DataTableDispute<TData, TValue>({
	                                                columns, reloadData
                                                }: DataTableProps<TData, TValue>) {
	const [data, setData] = useState<TData[]>([]);
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		[]
	)
	const [transactionId, setTransactionId] = useState<string>("");
	const [caseID, setCaseID] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	const [email, setEmail] = useState<string>("")
	const handleTransactionIdChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTransactionId(event.target.value);
	};
	const handleCustomerChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};
	const handleCaseIDChange = (event: ChangeEvent<HTMLInputElement>) => {
		setCaseID(event.target.value);
	};
	
	const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
		setDescription(event.target.value);
	};
	const [payGateSelected, setPayGateSelected] = useState<string[]>([]);
	const [payGateList, setPayGateList] = useState([]);
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});
	const [statusList, setStatusList] = useState<ComboxBoxItem[]>([]);
	const [statusSelected, setStatusSelected] = useState<string[]>([]);
	const [disputeTypeList, setDisputeTypeList] = useState<ComboxBoxItem[]>([]);
	const [dispyteTypeSelected, setDispyteTypeSelected] = useState<string[]>([]);
	const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const [pageSize, setPageSize] = useState(20);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageCount, setPageCount] = useState(0);
	const [rowCount, setRowCount] = useState(0);
	const [loading, setLoading] = useState(false);
	
	const loadData = async (query: QueryTransactionType) => {
		const result = await reloadData(query);
		if (result) {
			setData(result.data.content);
			setPageCount(result.data.totalPages);
			table.setPageIndex(result.data.pageable.pageNumber);
			table.setPageSize(result.data.pageable.pageSize);
			setRowCount(result.data.totalElements);
		}
	}
	
	function formatStatus(status: string): string {
		return status
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
	
	useEffect(() => {
		getPaymentGateList(500, 0).then((result) => {
			if (result)
				setPayGateList(result.data.content)
		})
		getDisputeStatus().then((result) => {
			if (result) {
				const statusList: ComboxBoxItem[] = [];
				result.data.forEach((item: string) => {
					statusList.push({id: item, name: formatStatus(item)})
				})
				setStatusList(statusList);
			}
		})
		getDisputeTypes().then((result) => {
			if (result) {
				const disputeTypeList: ComboxBoxItem[] = [];
				result.data.forEach((item: string) => {
					if (item)
						disputeTypeList.push({id: item, name: item})
				})
				setDisputeTypeList(disputeTypeList);
			}
		})
		const query: QueryTransactionType = {
			caseID: caseID,
			pageSize: pageSize,
			pageIndex: pageIndex,
			transaction: transactionId,
			description: description,
			payGateID: payGateSelected,
			dateRange: dateRange,
			status: statusSelected,
			type: dispyteTypeSelected,
			customerEmail: email
		}
		loadData(query);
	}, [pageIndex, pageSize]);
	const onSearch = () => {
		const query: QueryTransactionType = {
			caseID: caseID,
			pageSize: pageSize,
			pageIndex: pageIndex,
			transaction: transactionId,
			description: description,
			payGateID: payGateSelected,
			dateRange: dateRange,
			status: statusSelected,
			type: dispyteTypeSelected,
			customerEmail: email
		}
		loadData(query);
	}
	const download = async () => {
		setLoading(true)
		const query: QueryTransactionType = {
			caseID: caseID,
			pageSize: pageSize,
			pageIndex: pageIndex,
			transaction: transactionId,
			description: description,
			payGateID: payGateSelected,
			dateRange: dateRange,
			status: statusSelected,
			customerEmail: email,
		}
		Download(query).then((result) => {
			setLoading(false)
			if (result && result.status !== 200) {
				alert("Download failed")
			}
		});
	}
	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualPagination: true,
		autoResetPageIndex: true,
		pageCount: pageCount,
		rowCount: rowCount,
		
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})
	return (
		<div className="w-full">
			<div className="flex flex-col space-y-4 py-4">
				<div className="flex items-center justify-between flex-wrap space-x-4">
					<div className="flex items-center space-x-2">
						<DatePickerWithRange onValueChange={setDateRange}/>
						<Input
							type="text"
							value={caseID}
							onChange={handleCaseIDChange}
							placeholder="Case ID"
						/>
						<Input
							type="text"
							value={transactionId}
							onChange={handleTransactionIdChange}
							placeholder="Transaction ID"
						/>
						<Input
							type="text"
							value={email}
							onChange={handleCustomerChange}
							placeholder="Customer Email"
						/>
						<Input
							type="text"
							value={description}
							onChange={handleDescriptionChange}
							placeholder="Description"
						/>
						<ComboBoxTemplate
							data={payGateList}
							onValueChange={setPayGateSelected}
							placeholder="Select Pay Gate"
						/>
						<ComboBoxTemplate
							data={statusList}
							onValueChange={setStatusSelected}
							placeholder="Select Status"
						/>
						<ComboBoxTemplate
							data={disputeTypeList}
							onValueChange={setDispyteTypeSelected}
							placeholder="Select Types"
						/>
						<Button
							className="bg-[#dd4455] hover:bg-[#dd4456]"
							onClick={onSearch}
						>
							<Search className="mr-2 h-4 w-4"/>
							Search
						</Button>
					</div>
				</div>
				<div className="flex justify-end">
					{loading ? (
						<Button disabled>
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
							Please wait
						</Button>
					) : (
						<Button
							className="bg-[#2fa1da] hover:bg-[#2fa1da]"
							onClick={download}
						>
							<FileDown className="mr-2 h-4 w-4"/>
							Download
						</Button>
					)}
				</div>
			</div>
			
			
			<div className="rounded-md border" style={{
				maxHeight: '75vh', // Adjust the height as needed
				overflowY: 'auto',  // Enables vertical scrolling
			}}>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} style={{width: `${header.getSize()}px`}}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between py-4">
				<div className="flex-grow">
					<a href="/Dispute/history" className="underline text-sky-800 bold">History</a>
				</div>
				<div className="flex items-center space-x-2">
					<Badge>Total: {formatNumberInteger(rowCount)}</Badge>
					<Badge>Page {pageIndex + 1} of {formatNumberInteger(pageCount)}</Badge>
					<DropdownMenuTemplate
						options={[
							{value: '10', label: '10'},
							{value: '20', label: '20', default: true},
							{value: '50', label: '50'},
							{value: '100', label: '100'},
							{value: '200', label: '200'},
						]}
						onValueChange={(value) => {
							setPageIndex(0);
							setPageSize(parseInt(value, 10));
						}}
						title="Page Size"
					/>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPageIndex(pageIndex - 1)}
						disabled={pageIndex === 0}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPageIndex(pageIndex + 1)}
						disabled={pageIndex === pageCount - 1}
					>
						Next
					</Button>
				</div>
			</div>
		
		</div>
	)
}