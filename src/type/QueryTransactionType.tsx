import {DateRange} from "react-day-picker";

export interface QueryTransactionType {
	caseID?: string,
	pageSize: number,
	pageIndex: number,
	transaction?: string,
	description?: string,
	payGateID?: string[],
	status?: string[],
	customerEmail?: string,
	dateRange?: DateRange | undefined,
	type?: string[],
}