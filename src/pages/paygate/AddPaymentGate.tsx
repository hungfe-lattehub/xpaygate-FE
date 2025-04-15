import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ListLink, NavTemplate } from "@/components/NavTemplate";
import { Toaster } from "@/components/ui/toaster";
import { addNewPaymentGate } from "@/service/PaymentGate.tsx";

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	type: z.enum(["Stripe", "Paypal"], { message: "Type is required" }),
	groupName: z.string().min(1, { message: "Group Name is required" }),
	email: z.string().email({ message: "Email is required" }),
	apiKey: z.string().optional(),
	apiSecret: z.string().min(1, { message: "API Secret is required" }),
	apiUsername: z.string().optional(),
	apiPassword: z.string().optional(),
	apiSignature: z.string().optional(),
}).refine((data) => {
	return !(data.type === "Paypal" && (!data.apiKey));
	
}, {
	message: "API Key, API Username, API Password, and API Signature are required for Paypal type",
	path: ["apiKey", "apiUsername", "apiPassword", "apiSignature"],
});

export default function AddNewPaymentGate() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			type: "Paypal",
			groupName: "",
			apiKey: "",
			apiSecret: "",
			apiUsername: "",
			apiPassword: "",
			apiSignature: "",
		},
	});
	
	const { toast } = useToast();
	const type = useWatch({
		control: form.control,
		name: "type",
	});
	
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const paygate = {
			name: values.name,
			email: values.email,
			type: values.type.toUpperCase(),
			groupName: values.groupName,
			apiKey: values.apiKey,
			apiSecret: values.apiSecret,
			apiUserName: values.apiUsername,
			apiPassword: values.apiPassword,
			apiSignature: values.apiSignature,
		};
		const response = await addNewPaymentGate(paygate);
		if (response !== undefined) {
			if (response.status !== 200) {
				toast({
					variant: "destructive",
					title: "Create Payment Gate Failed",
					description: response.data.message,
				});
			} else {
				toast({
					title: "Create Payment Gate Success",
					description: `${response.data.name} has been created successfully!`,
				});
				form.reset();
			}
		}
	}
	
	const listLink: ListLink[] = [
		{ href: "/paymentgate", text: "List Payment Gates" },
		{ href: "/addpaymentgate", text: "Add New Payment Gate", primary: true },
	];
	
	return (
		<NavTemplate title="Add Payment Gate" listLinks={listLink}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
					<div className="flex space-x-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="w-1/2">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="groupName"
							render={({ field }) => (
								<FormItem className="w-1/2">
									<FormLabel>Group Name</FormLabel>
									<FormControl>
										<Input placeholder="Group Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Type</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="Stripe">Stripe</SelectItem>
										<SelectItem value="Paypal">Paypal</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					{type === "Paypal" ? (
						<>
							<FormField
								control={form.control}
								name="apiKey"
								render={({ field }) => (
									<FormItem>
										<FormLabel>API Key</FormLabel>
										<FormControl>
											<Input placeholder="API Key" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="apiSecret"
								render={({ field }) => (
									<FormItem>
										<FormLabel>API Secret</FormLabel>
										<FormControl>
											<Input placeholder="API Secret" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="apiUsername"
								render={({ field }) => (
									<FormItem>
										<FormLabel>API Username (NVP)</FormLabel>
										<FormControl>
											<Input placeholder="API Username" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="apiPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>API Password (NVP)</FormLabel>
										<FormControl>
											<Input placeholder="API Password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="apiSignature"
								render={({ field }) => (
									<FormItem>
										<FormLabel>API Signature (NVP)</FormLabel>
										<FormControl>
											<Input placeholder="API Signature" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					) : (
						<FormField
							control={form.control}
							name="apiSecret"
							render={({ field }) => (
								<FormItem>
									<FormLabel>API Secret</FormLabel>
									<FormControl>
										<Input placeholder="API Secret" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<Toaster />
		</NavTemplate>
	);
}
