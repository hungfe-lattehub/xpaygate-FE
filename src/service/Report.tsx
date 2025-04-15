import {DateRange} from "react-day-picker";
import {format} from "date-fns";
import {BASE_DOMAIN, getToken} from "@/service/utils.tsx";

export const getReport = async (query: {
	dateRange?: DateRange | undefined,
	paygateID?: string,
}) => {
	const params = new URLSearchParams({});
	if (query.dateRange) {
		if (query.dateRange.from) {
			params.append('dateFrom', format(query.dateRange.from, 'yyyy-MM-dd'));
		}
		if (query.dateRange.to) {
			params.append('dateTo', format(query.dateRange.to, 'yyyy-MM-dd'));
		}
	}
	if (query.paygateID) {
		params.append('payGateId', query.paygateID);
	}
	const response = await fetch(`${BASE_DOMAIN}/api/v1/report?${params.toString()}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application,json',
			'Authorization': `Bearer ${getToken()}`,
		},
	});
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}

