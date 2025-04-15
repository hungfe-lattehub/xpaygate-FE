import {BASE_DOMAIN, getToken} from "@/service/utils.tsx";
import {QueryTransactionType} from "@/type/QueryTransactionType.tsx";
import {format} from "date-fns";

export const fecthTransactionList = async (query: QueryTransactionType) => {
	const params = new URLSearchParams({
		page: query.pageIndex.toString(),
		size: query.pageSize.toString(),
	});
	if (query.transaction && query.transaction.trim() !== '') {
		params.append('transaction', query.transaction);
	}
	if (query.description && query.description.trim() !== '') {
		params.append('description', query.description);
	}
	if (query.payGateID && query.payGateID.length > 0) {
		query.payGateID.forEach(id => params.append('paygate', id));
	}
	if (query.customerEmail && query.customerEmail.trim() !== '') {
		params.append('customerEmail', query.customerEmail);
	}
	if (query.dateRange) {
		if (query.dateRange.from) {
			params.append('dateFrom', format(query.dateRange.from, 'yyyy-MM-dd'));
		}
		if (query.dateRange.to) {
			params.append('dateTo', format(query.dateRange.to, 'yyyy-MM-dd'));
		}
	}
	if(query.type && query.type.length > 0){
		query.type.forEach(type => params.append('type', type));
	}
	const response = await fetch(`${BASE_DOMAIN}/api/v1/transaction?${params.toString()}`, {
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
export const downloadTransaction = async (query: QueryTransactionType) => {
	const params = new URLSearchParams();
	if (query.transaction && query.transaction.trim() !== '') {
		params.append('transaction', query.transaction);
	}
	if (query.description && query.description.trim() !== '') {
		params.append('description', query.description);
	}
	if (query.payGateID && query.payGateID.length > 0) {
		query.payGateID.forEach(id => params.append('paygate', id));
	}
	if (query.dateRange) {
		if (query.dateRange.from) {
			params.append('dateFrom', format(query.dateRange.from, 'yyyy-MM-dd'));
		}
		if (query.dateRange.to) {
			params.append('dateTo', format(query.dateRange.to, 'yyyy-MM-dd'));
		}
	} else return {data: null, status: 400};
	const response = await fetch(`${BASE_DOMAIN}/api/v1/transaction/export?${params.toString()}`, {
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
			a.download = 'transaction.xlsx'; // Adjust the filename as needed
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
			return {data: null, status: response.status};
		}
	}
}
export const getAllTrackingUpload = async (pageSize: number, pageIndex: number) => {
	const params = new URLSearchParams({
		page: pageIndex.toString(),
		size: pageSize.toString(),
	});
	const response = await fetch(`${BASE_DOMAIN}/api/v1/tracking?${params.toString()}`, {
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
export const uploadExcelFile = async (file: File) => {
	const formData = new FormData();
	formData.append('file', file);
	
	const response = await fetch(`${BASE_DOMAIN}/api/v1/tracking/upload`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${getToken()}`,
		},
		body: formData,
	});
	
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}
export const exportResult = async (link: string) => {
	// downloadFile(id);
	const response = await fetch(`${BASE_DOMAIN}${link}`, {
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
			a.download = 'result.xlsx'; // Adjust the filename as needed
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
			return {data: null, status: response.status};
		}
	}
}
export const findTransactionByID = async (transactionID: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/transaction/${transactionID}`, {
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
export const getTransactionType = async () => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/transaction/type`, {
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