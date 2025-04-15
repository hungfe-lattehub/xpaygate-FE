import {BASE_DOMAIN, getToken} from "@/service/utils.tsx";
import {ConfigPayoutType} from "@/type/ConfigPayoutType.tsx";
import {PayoutRequest} from "@/type/PayoutRequest.tsx";

export const createOrUpdateConfigPayout = async (configPayout: ConfigPayoutType) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/config-payout/createOrUpdate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify(configPayout)
	});
	
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}
export const getConfigPayoutById = async (payGateId: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/config-payout/${payGateId}`, {
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
export const deleteConfigPayoutById = async (payGateId: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/config-payout/${payGateId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
	});
	
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		return {status: response.status};
	}
}
export const getAllConfigPayout = async (pageSize: number, pageIndex: number) => {
	const params = new URLSearchParams({
		page: pageIndex.toString(),
		size: pageSize.toString(),
	});
	const response = await fetch(`${BASE_DOMAIN}/api/v1/config-payout?${params.toString()}`, {
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
export  const getAllHistoryPayout = async (pageSize: number, pageIndex: number) => {
	const params = new URLSearchParams({
		page: pageIndex.toString(),
		size: pageSize.toString(),
	});
	const response = await fetch(`${BASE_DOMAIN}/api/v1/config-payout/history-payout?${params.toString()}`, {
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
export const payoutNow = async (data: PayoutRequest) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/config-payout/send-payout-now`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify(data)
	});
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}
export const updateNote = async (historyID: string, note: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/config-payout/edit-note/${historyID}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: note
	});
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		return {status: response.status};
	}
}