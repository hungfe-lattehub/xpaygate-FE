import {BASE_DOMAIN, getToken} from "@/service/utils.tsx";
import {Paygate} from "@/type/Paygate.tsx";

export const getPaymentGateList = async (pageSize: number, pageIndex: number) => {
	const params = new URLSearchParams({
		page: pageIndex.toString(),
		size: pageSize.toString(),
	});
	const response = await fetch(`${BASE_DOMAIN}/api/v1/paygate?${params.toString()}`, {
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
export const addNewPaymentGate = async (paygate: {
	name: string,
	type: string,
	email: string,
	groupName: string,
	apiKey?: string,
	apiSecret: string,
	apiUsername?: string,
	apiPassword?: string,
	apiSignature?: string
}) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/paygate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify(paygate)
	});
	
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
};

export const updatePaymentGate = async (paygate: Paygate) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/paygate/${paygate.id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify(paygate)
	});
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}
export const getAllPayPalPaymentGate = async () => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/paygate/paypal`, {
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
export const getPaymentGateById = async (id: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/paygate/${id}`, {
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
export const deletePaymentGate = async (id: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/paygate/${id}`, {
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
		const data = await response.json();
		return {data, status: response.status};
	}
}