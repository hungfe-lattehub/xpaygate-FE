import React, {useState} from 'react'
import '@/App.css'
import {Button} from '@/components/ui/button'
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useAuth} from "@/components/AuthProvider.tsx";
import {Navigate, useLocation} from "react-router-dom";
import {ExclamationTriangleIcon, ReloadIcon} from "@radix-ui/react-icons";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {LogoPage} from "@/components/LogoPage.tsx";

function Login() {
	const {login, isAuthenticated} = useAuth();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			await login({email, password});
			if (isAuthenticated()) {
				return <Navigate to="/dashboard" state={{from: location}}/>;
			}
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
		setLoading(false);
		if (isAuthenticated()) {
			return <Navigate to="/dashboard" state={{from: location}}/>;
		}
	}
	if (isAuthenticated()) return <Navigate to="/dashboard" state={{from: location}}/>;
	return (
		<div>
			<div className="w-full lg:grid lg:grid-cols-[30%_70%] xl:min-h-[1080px]">
				<div className="flex items-center justify-center py-12 z-[100]">
					<Card className="w-full lg:ml-auto lg:mr-0 lg:w-3/4">
						<CardHeader>
							<CardTitle className="text-2xl">Login</CardTitle>
							<CardDescription>
								Enter your email below to login to your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit}>
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="m@example.com"
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
									<div className="grid gap-2">
										<div className="flex items-center">
											<Label htmlFor="password">Password</Label>
										</div>
										<Input
											id="password"
											type="password"
											required
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
									</div>
									{error && (
										<Alert variant="destructive">
											<ExclamationTriangleIcon className="h-4 w-4"/>
											<AlertTitle>Error</AlertTitle>
											<AlertDescription>
												{error}
											</AlertDescription>
										</Alert>
									)}
									<Button disabled={loading} type="submit" className="w-full bg-[#E84E48] hover:bg-[#E84E48]">
										{loading ? (
											<>
												<ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
												Please wait
											</>
										) : (
											'Login'
										)}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
				<div className="flex items-center justify-center py-12 z-[100]">
					<img src="/logo.svg" alt="login" className="w-full max-w-3xl"/>
				</div>
			</div>
			<div className="hidden lg:block">
				<LogoPage></LogoPage>
			</div>
		</div>
	)
}

export default Login
