export const BASE_DOMAIN = import.meta.env.VITE_REACT_APP_BASE_DOMAIN || 'https://api.tdpaygate.com';
export const AUTHORITIES = [
	{name: "Manage Dispute", value: ["DISPUTE_VIEW", "DISPUTE_EDIT"]},
	{name: "Manage Payment", value: ["PAYMENT_VIEW", "PAYMENT_EDIT"]},
	{name: "Manage User", value: ["USER_VIEW", "USER_EDIT"]},
	{name: "Manage Payout", value: ["PAYOUT"]},
	{name: "Manage Tracking", value: ["TRACKING"]},
]

export function getToken() {
	return JSON.parse(localStorage.getItem('user') as string).access_token;
}
export const formatNumber = (num: number) => num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const formatNumberInteger = (num: number) => num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
