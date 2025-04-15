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
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDownIcon, ReloadIcon} from "@radix-ui/react-icons";
import {ChangeEvent, useEffect, useState} from "react";
import DropdownMenuTemplate from "./DropdownTemplate";
import {Badge} from "./ui/badge";
import {Input} from "@/components/ui/input.tsx";
import {ComboBoxTemplate} from "@/components/ComboBoxTemplate.tsx";
import {getPaymentGateList} from "@/service/PaymentGate.tsx";
import {QueryTransactionType} from "@/type/QueryTransactionType.tsx";
import {FileDown, Search} from "lucide-react";
import {QueryRefundType} from "@/type/QueryRefundType.tsx";
import {Download} from "@/service/Refund.tsx";
import {formatNumberInteger} from "@/service/utils.tsx";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	reloadData?: any,
	reloadKey?: number,
}

export function DataTableRefund<TData, TValue>({
	                                               columns, reloadData,reloadKey
                                               }: DataTableProps<TData, TValue>) {
	const [data, setData] = useState<TData[]>([]);
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		[]
	)
	const [transactionId, setTransactionId] = useState<string>("");
	const handleTransactionIdChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTransactionId(event.target.value);
	};
	const [payGateSelected, setPayGateSelected] = useState<string[]>([]);
	const [payGateList, setPayGateList] = useState([]);
	
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
	
	
	useEffect(() => {
		getPaymentGateList(500, 0).then((result) => {
			if (result)
				setPayGateList(result.data.content)
		})
		const query: QueryRefundType = {
			pageSize: pageSize,
			pageIndex: pageIndex,
			transactionID: transactionId,
			payGateID: payGateSelected,
		}
		loadData(query);
	}, [pageIndex, pageSize,reloadKey]);
	const onSearch = () => {
		const query: QueryRefundType = {
			pageSize: pageSize,
			pageIndex: pageIndex,
			transactionID: transactionId,
			payGateID: payGateSelected,
		}
		loadData(query);
	}
	const download = async () => {
		setLoading(true)
		const query: QueryRefundType = {
			pageSize: pageSize,
			pageIndex: pageIndex,
			transactionID: transactionId,
			payGateID: payGateSelected,
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
			<div className="flex items-center justify-between py-4">
				<div className="flex items-center space-x-4">
					<Input
						type="text"
						value={transactionId}
						onChange={handleTransactionIdChange}
						placeholder="Transaction ID"
					/>
					<ComboBoxTemplate
						data={payGateList}
						onValueChange={setPayGateSelected}
						placeholder="Select Pay Gate"
					/>
					<Button
						className="bg-[#dd4455] hover:bg-[#dd4456]"
						onClick={onSearch}
					>
						<Search className="mr-2 h-4 w-4"/>
						Search
					</Button>
				</div>
				<div className="flex items-center space-x-2">
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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								Columns
								<ChevronDownIcon className="ml-2 h-4 w-4"/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			
			
			<div className="rounded-md border" 				style={{
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
			<div className="flex justify-end space-x-2 py-2">
				<Badge>Total:  {formatNumberInteger(rowCount)}</Badge>
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
	)
}