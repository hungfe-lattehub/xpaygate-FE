import {BASE_DOMAIN, getToken} from "@/service/utils.tsx";
import {QueryRefundType} from "@/type/QueryRefundType.tsx";

export const getAllRefund = async (query: QueryRefundType) => {
	const params = new URLSearchParams();
	params.append('page', query.pageIndex.toString());
	params.append('size', query.pageSize.toString());
	if (query.transactionID && query.transactionID.trim() !== '') {
		params.append('transactionID', query.transactionID);
	}
	if (query.payGateID && query.payGateID.length > 0) {
		query.payGateID.forEach(id => params.append('paygate', id));
	}
	const response = await fetch(`${BASE_DOMAIN}/api/v1/refund?${params.toString()}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
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
export const createRefund = async (transactionID: string, amount: number, payGateID: string, reason: string,isCheck:boolean) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/refund/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify({
			transactionId: transactionID,
			amount: amount,
			reason: reason,
			payGateId: payGateID,
			isCheck:isCheck
		}),
	});
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}
export const Download = async (query: QueryRefundType) => {
	const params = new URLSearchParams();
	params.append('page', query.pageIndex.toString());
	params.append('size', query.pageSize.toString());
	if (query.transactionID && query.transactionID.trim() !== '') {
		params.append('transactionID', query.transactionID);
	}
	if (query.payGateID && query.payGateID.length > 0) {
		query.payGateID.forEach(id => params.append('paygate', id));
	}
	const response = await fetch(`${BASE_DOMAIN}/api/v1/refund/export?${params.toString()}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
	});
	
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const contentType = response.headers.get('Content-Type');
		if (contentType === 'application/json') {
			const data = await response.json();
			return {data, status: response.status};
		} else {
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'refund.xlsx'; // Adjust the filename as needed
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
			return {data: null, status: response.status};
		}
	}
}
