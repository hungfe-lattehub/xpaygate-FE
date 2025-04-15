import {BASE_DOMAIN, getToken} from "@/service/utils.tsx";

export const CreateUserService = async (user: any) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${getToken()}`,
		},
		body: JSON.stringify(user),
	});
	const data = await response.json();
	return {data, status: response.status};
}
export const getUsers = async (pageSize: number, pageIndex: number) => {
	const params = new URLSearchParams({
		page: pageIndex.toString(),
		size: pageSize.toString(),
	});
	const response = await fetch(`${BASE_DOMAIN}/api/v1/users?${params.toString()}`, {
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
export const assignPaygate = async (userID: string, paygateIDs: string[]) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/users/assign/${userID}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify(paygateIDs)
	});
	const data = await response.json();
	return {data, status: response.status};
};
export const deleteUser = async (userID: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/users/delete/${userID}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
	});
	const data = await response.json();
	return {data, status: response.status};
}
export const changeAuthorize = async (id: string, authorities: string[]) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/users/update/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify(authorities)
	});
	const data = await response.json();
	return {data, status: response.status};
};
export const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
	const response = await fetch(`${BASE_DOMAIN}/api/v1/users`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getToken()}`,
		},
		body: JSON.stringify({
			currentPassword: currentPassword,
			newPassword: newPassword,
			confirmationPassword: confirmPassword
		})
	});
	return {status: response.status};
}