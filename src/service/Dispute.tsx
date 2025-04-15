import {QueryTransactionType} from "@/type/QueryTransactionType.tsx";
import {format} from "date-fns";
import {BASE_DOMAIN, getToken} from "@/service/utils.tsx";

export const fetchDisputeList = async (query: QueryTransactionType) => {
	const params = new URLSearchParams({
		page: query.pageIndex.toString(),
		size: query.pageSize.toString(),
	});
	if (query.transaction && query.transaction.trim() !== '') {
		params.append('transaction', query.transaction);
	}
	if (query.caseID && query.caseID.trim() !== '') {
		params.append('disputeID', query.caseID);
	}
	if (query.description && query.description.trim() !== '') {
		params.append('description', query.description);
	}
	if(query.customerEmail && query.customerEmail.trim() !== ''){
		params.append('customerEmail', query.customerEmail);
	}
	if (query.payGateID && query.payGateID.length > 0) {
		query.payGateID.forEach(id => params.append('paygate', id));
	}
	if (query.status && query.status.length > 0) {
		query.status.forEach(status => params.append('status', status));
	}
	if (query.dateRange) {
		if (query.dateRange.from) {
			params.append('dateFrom', format(query.dateRange.from, 'yyyy-MM-dd'));
		}
		if (query.dateRange.to) {
			params.append('dateTo', format(query.dateRange.to, 'yyyy-MM-dd'));
		}
	}
	if (query.type && query.type.length > 0) {
		query.type.forEach(type => params.append('type', type));
	}
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute?${params.toString()}`, {
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
export const Download = async (query: QueryTransactionType) => {
	const params = new URLSearchParams();
	if (query.transaction && query.transaction.trim() !== '') {
		params.append('transaction', query.transaction);
	}
	if (query.caseID && query.caseID.trim() !== '') {
		params.append('disputeID', query.caseID);
	}
	if (query.description && query.description.trim() !== '') {
		params.append('description', query.description);
	}
	if (query.payGateID && query.payGateID.length > 0) {
		query.payGateID.forEach(id => params.append('paygate', id));
	}
	if (query.status && query.status.length > 0) {
		query.status.forEach(status => params.append('status', status));
	}
	if (query.dateRange) {
		if (query.dateRange.from) {
			params.append('dateFrom', format(query.dateRange.from, 'yyyy-MM-dd'));
		}
		if (query.dateRange.to) {
			params.append('dateTo', format(query.dateRange.to, 'yyyy-MM-dd'));
		}
	}
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/export?${params.toString()}`, {
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
			const contentDisposition = response.headers.get('Content-Disposition');
			let filename = 'disputes.xlsx'; // Default filename
			if (contentDisposition && contentDisposition.includes('filename=')) {
				filename = contentDisposition.split('filename=')[1].replace(/['"]/g, '');
			}
			console.log(contentDisposition)
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename; // Adjust the filename as needed
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
			return {data: null, status: response.status};
		}
	}
}
export const getDisputeStatus = async () => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/status`, {
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
export const getDisputeTypes = async () => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/types`, {
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

export const getDisputeDetail = async (id: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application / json',
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

export const sendMessge = async (id: string, message: string, file?: FileList) => {
	const formData = new FormData();
	formData.append('message', message);
	if (file && file.length > 0) {
		for (let i = 0; i < file.length; i++) {
			formData.append('files', file[i]);
		}
	}
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${id}/message`, {
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
export const provideSupportingInfo = async (id: string, message: string, file?: FileList) => {
	const formData = new FormData();
	formData.append('notes', message);
	if (file && file.length > 0) {
		for (let i = 0; i < file.length; i++) {
			formData.append('files', file[i]);
		}
	}
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${id}/provide-support-info`, {
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
export const appeal = async (id: string, message: string, file?: FileList) => {
	const formData = new FormData();
	formData.append('notes', message);
	if (file && file.length > 0) {
		for (let i = 0; i < file.length; i++) {
			formData.append('files', file[i]);
		}
	}
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${id}/appeal`, {
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
export const acceptClaim = async (id: string, note: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${id}/accept-claim`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify({note}),
	});
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}
export const escalate = async (id: string, note: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${id}/escalate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify({note}),
	});
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}
export const makeOffer = async (id: string, amount: number, note: string, type: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${id}/make-offer?type=${type}&amount=${amount}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: note,
	});
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}
export const downloadDocument = async (id: string,name:string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/downloadFile?id=${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
	});
	const contentType = response.headers.get('Content-Type');
	if (contentType === 'application/json') {
		const data = await response.json();
		return {data, status: response.status};
	} else {
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
		return {data: null, status: response.status};
	}
}
export const provideEvidence = async (disputeID: string, note: string, evidenceType: string, file?: FileList,
                                      tracking?: string, refundTransactionID?: string) => {
	const formData = new FormData();
	formData.append('note', note);
	if (file && file.length > 0) {
		for (let i = 0; i < file.length; i++) {
			formData.append('files', file[i]);
		}
	}
	if (tracking) {
		formData.append('tracking', tracking);
	}
	if (refundTransactionID) {
		formData.append('refundTransactionId', refundTransactionID);
	}
	formData.append('type', evidenceType);
	console.log(formData)
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${disputeID}/provide-evidence`, {
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
};
export const adjudicate = async (disputeID: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${disputeID}/adjudicate`, {
		method: 'POST',
		headers: {
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
export const requireEvidence = async (disputeID: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${disputeID}/require-evidence`, {
		method: 'POST',
		headers: {
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
export const reloadData = async (disputeID: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/fetch/${disputeID}`, {
		method: 'GET',
		headers: {
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
export const counterDispute = async (
	id: string,
	trackingNumber?: string,
	trackingCarrier?: string,
	productDescription?: string,
	shippingAddress?: string,
	shippingDate?: string,
	files?: { [key: string]: FileList | undefined },
	additionalInfo?: string
) => {
	const formData = new FormData();
	if (productDescription) formData.append('productDescription', productDescription);
	if (trackingNumber) formData.append('trackingNumber', trackingNumber);
	if (trackingCarrier) formData.append('trackingCarrier', trackingCarrier);
	if (shippingAddress) formData.append('shippingAddress', shippingAddress);
	if (shippingDate) formData.append('shippingDate', shippingDate);
	if (additionalInfo) formData.append('additionalInfo', additionalInfo);
	const fileFields = [
		'cancellationPolicy',
		'customerCommunication',
		'customerSignature',
		'duplicateChargeDocumentation',
		'receipt',
		'refundPolicy',
		'serviceDocumentation',
		'shippingDocumentation',
		'uncategorizedFile'
	];
	
	fileFields.forEach(field => {
		const fileList = files?.[field];
		if (fileList && fileList[0]) {
			formData.append(field, fileList[0]);
		}
	});
	
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/${id}/counter`, {
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

export const getDisputeExportHistory = async (pageSize: number, pageIndex: number) => {
	// generate params
	const params = new URLSearchParams({
		page: pageIndex.toString(),
		size: pageSize.toString(),
	});
	const response = await fetch(`${BASE_DOMAIN}/api/v1/dispute/history?${params.toString()}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		}
	});
	if (response.status === 403) {
		localStorage.removeItem('user');
		window.location.href = '/login';
	} else {
		const data = await response.json();
		return {data, status: response.status};
	}
}
export const downloadDisputeExport = async (url: string) => {
	const response = await fetch(`${BASE_DOMAIN}${url}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		}
	});
	const contentType = response.headers.get('Content-Type');
	if (contentType === 'application/json') {
		const data = await response.json();
		return {data, status: response.status};
	} else {
		const contentDisposition = response.headers.get('Content-Disposition');
		let filename = 'disputes.xlsx'; // Default filename
		if (contentDisposition && contentDisposition.includes('filename=')) {
			filename = contentDisposition.split('filename=')[1].replace(/['"]/g, '');
		}
		console.log(contentDisposition)
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename; // Adjust the filename as needed
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
		return {data: null, status: response.status};
	}
}