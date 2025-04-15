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
	TableRow,
} from "@/components/ui/table"
import {Input} from "@/components/ui/input.tsx";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import {useEffect, useState} from "react";
import DropdownMenuTemplate from "./DropdownTemplate";
import {Badge} from "./ui/badge";
import {formatNumberInteger} from "@/service/utils.tsx";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	reloadData?: any,
	reloadKey?: number,
	hideFilter?: boolean
}

export function DataTable<TData, TValue>({
	                                         columns, reloadData, reloadKey, hideFilter
                                         }: DataTableProps<TData, TValue>) {
	const [data, setData] = useState<TData[]>([]);
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const [pageSize, setPageSize] = useState(50);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageCount, setPageCount] = useState(0);
	const [rowCount, setRowCount] = useState(0);
	
	useEffect(() => {
		const loadData = async (pageSize: number, pageIndex: number) => {
			const result = await reloadData(pageSize, pageIndex);
			if (result) {
				setData(result.data.content);
				setPageCount(result.data.totalPages);
				table.setPageIndex(result.data.pageable.pageNumber);
				table.setPageSize(result.data.pageable.pageSize);
				setRowCount(result.data.totalElements);
			}
		}
		loadData(pageSize, pageIndex);
	}, [pageIndex, pageSize, reloadKey]);
	
	const [globalFilter, setGlobalFilter] = useState("");
	
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
		globalFilterFn: 'includesString',
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter
		},
	})
	
	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				{!hideFilter && (
					<Input
						placeholder="Filter all fields..."
						value={globalFilter ?? ""}
						onChange={(event) => setGlobalFilter(event.target.value)}
						className="max-w-sm"
					/>
				)}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDownIcon className="ml-2 h-4 w-4"/>
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
			<div className="rounded-md border" style={{maxHeight: "75vh", overflowY: "auto"}}>
				<Table style={{tableLayout: "fixed"}}>
					<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									style={{
										position: "sticky",
										top: 0,
										backgroundColor: "white",
										zIndex: 10,
									}}
								>
									{header.isPlaceholder
										? null
										: flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
								</TableHead>
							))}
						</TableRow>
					))}
					</thead>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="space-x-2">
					<Badge>Total: {formatNumberInteger(rowCount)}</Badge>
					<Badge>Page {pageIndex + 1} of {formatNumberInteger(pageCount)}</Badge>
					<DropdownMenuTemplate
						options={[
							{value: "10", label: "10"},
							{value: "20", label: "20"},
							{value: "50", label: "50", default: true},
							{value: "100", label: "100"},
							{value: "200", label: "200"},
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
