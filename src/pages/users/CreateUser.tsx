import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {AUTHORITIES} from "@/service/utils.tsx";
import {CheckedState} from "@radix-ui/react-checkbox";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form.tsx";
import {useState} from "react";
import {CreateUserService} from "@/service/User.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {ListLink, NavTemplate} from "@/components/NavTemplate.tsx";

export default function CreateUser() {
	const [AUTHORITIES_CHECKBOX, setAuthoritiesCheckbox] = useState(
		AUTHORITIES.map(authority => ({
			...authority,
			checked: false,
		}))
	);
	const onAuthoritiesChange = (checked: CheckedState, authorityValues: string[]) => {
		setAuthoritiesCheckbox(prevState => {
			const updatedAuthorities = prevState.map(authority => {
				if (authority.value === authorityValues) {
					return {...authority, checked: checked === true};
				}
				return authority;
			});
			form.setValue("authorities", updatedAuthorities.filter(authority => authority.checked).flatMap(authority => authority.value));
			return updatedAuthorities;
		});
	};
	const formSchema = z.object({
		fullName: z.string().min(1, {message: "Full Name is required"}),
		email: z.string().email(),
		password: z.string().min(6, {message: "Password must be at least 6 characters"}),
		authorities: z.array(z.string()),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			authorities: [],
		},
	})
	const {toast} = useToast()
	
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const {data, status} = await CreateUserService(values);
		if (status !== 200) {
			toast({
				variant: "destructive",
				title: "Create User Failed",
				description: data.message,
			})
		} else {
			toast({
				title: "Create User Success",
				description: data.email + " has been created successfully!",
			})
			form.reset();
			setAuthoritiesCheckbox(AUTHORITIES.map(authority => ({
				...authority,
				checked: false,
			})))
		}
	}
	
	const listLink: ListLink[] = [
		{href: "/managerusers", text: "List Users",},
		{href: "/createuser", text: "Create new user", primary: true},
	]
	return (<NavTemplate title={'Create new user'} listLinks={listLink}>
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
				<FormField
					control={form.control}
					name="fullName"
					render={({field}) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input placeholder="Full Name" {...field} />
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({field}) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="a@gmail.com" {...field} />
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({field}) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input autoComplete="new-password" type="password" placeholder="*****" {...field} />
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<div className="flex flex-col items-start space-y-2">
					{AUTHORITIES_CHECKBOX.map((authority: any, index: number) => (
						<div key={index} className="flex items-center space-x-2">
							<Checkbox checked={authority.checked} onCheckedChange={(checked) => {
								onAuthoritiesChange(checked, authority.value)
							}} id={`authority-${index}`}/>
							<label htmlFor={`authority-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								{authority.name}
							</label>
						</div>
					))}
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
		<Toaster/>
	</NavTemplate>)
}