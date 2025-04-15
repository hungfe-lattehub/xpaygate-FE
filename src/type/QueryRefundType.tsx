
export interface QueryRefundType {
	pageSize: number,
	pageIndex: number,
	transactionID?: string,
	payGateID?: string[],
}