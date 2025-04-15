export type Paygate = {
	id: number,
	name: string,
	type: string,
	email: string,
	groupName: string,
	apiKey: string,
	balances: {
		id: {
			paygate_id: number,
			currency: string
		},
		available_balance: number,
		hold_balance: number
	}[],
	domain: string,
	holdStatus: string;
	limitStatus: string
	balanceRealtime: string;
}