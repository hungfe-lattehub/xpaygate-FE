import React, {createContext, useContext, useState, ReactNode} from 'react';
import {BASE_DOMAIN} from "@/service/utils.tsx";

interface User {
	access_token: string;
	refresh_token: string;
	authorities: string[];
}

interface LoginData {
	email: string;
	password: string;
}

interface AuthContextType {
	user: User | null;
	login: (data: LoginData) => void;
	logout: () => void;
	isAuthenticated: () => boolean;
	isAdmin: () => boolean;
	hasPayoutPermission: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
	const [user, setUser] = useState<User | null>(() => {
		const userData = localStorage.getItem('user');
		return userData ? JSON.parse(userData) : null;
	});
	
	const login = async (user: LoginData) => {
		const response = await fetch(`${BASE_DOMAIN}/api/v1/auth/authenticate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: user.email,
				password: user.password
			})
		});
		
		if (!response.ok) {
			throw new Error('Login failed');
		}
		
		const data = await response.json();
		const userData: User = {
			access_token: data.access_token,
			refresh_token: data.refresh_token,
			authorities: data.authorities
		};
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
	};
	const hasPayoutPermission = () => {
		return user !== null && (user?.authorities?.includes('PAYOUT') || user?.authorities?.includes('ADMIN'));
	}
	const logout = () => {
		setUser(null);
		localStorage.removeItem('user');
	};
	const isAuthenticated = () => {
		return user !== null;
	};
	const isAdmin = () => {
		return user !== null && user?.authorities.includes('ADMIN');
	}
	return (
		<AuthContext.Provider value={{user, login, logout, isAuthenticated, isAdmin, hasPayoutPermission}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
