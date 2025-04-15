import {ListLink, NavTemplate} from "@/components/NavTemplate.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {useEffect, useState} from "react";
import {getAllPayPalPaymentGate, getPaymentGateById} from "@/service/PaymentGate.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PayoutRequest} from "@/type/PayoutRequest.tsx";
import {payoutNow} from "@/service/ConfigPayout.tsx";
import {toast} from "@/components/ui/use-toast.ts";
import {ReloadIcon} from "@radix-ui/react-icons";
import {ComboboxSingleSelect} from "@/components/ComboBoxSingleSelect.tsx";

const listLink: ListLink[] = [
	{href: "/payout", text: "Manage Payout"},
	{href: "/payout/config", text: "Config Payout",},
	{href: "/payout/history", text: "History",},
	{href: "/payout/send", text: "Payout Now", primary: true},

]
const formSchema = z.object({
	payGateId: z.string(),
	note: z.string(),
	emailSubject: z.string(),
	emailMessage: z.string(),
	email: z.string().email(),
	amount: z.coerce.number().positive(),
	currency: z.string(),
});

export function PayoutNow() {
	const [paygateList, setPaygateList] = useState([]);
	const [selectedPayGate, setSelectedPayGate] = useState("")
	const [balances, setBalances] = useState([]);
	const [isLoading, setIsLoading] = useState(false)
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			payGateId: "",
			note: "Thanks you for use my service",
			emailSubject: "You have a payout",
			emailMessage: "You have received a payout! Thanks for using our service!",
			email: "",
			amount: 0,
			currency: "USD"
		},
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		const payoutRequest: PayoutRequest = {
			payGateId: selectedPayGate,
			note: values.note,
			emailSubject: values.emailSubject,
			emailMessage: values.emailMessage,
			email: values.email,
			amount: values.amount,
			currency: "USD"
		}
		payoutNow(payoutRequest).then((response) => {
			if (response && response.status === 200) {
				toast({
					title: "Success",
					description: "Payout has been sent successfully!",
				});
				form.reset();
			} else {
				toast({
					variant: "destructive",
					title: "Failed",
					description: "Failed to send payout",
				});
			}
			setIsLoading(false)
		});
	};
	const onError = (errors: any) => {
		console.log(errors);
	};
	const onValueChange = async (value: string) => {
		setSelectedPayGate(value);
		getPaymentGateById(value).then((response) => {
			if (response && response.status === 200 && response.data !== null) {
				const data = response.data;
				setBalances(data.balances);
			}
		});
	};
	useEffect(() => {
		getAllPayPalPaymentGate().then((res) => {
			if (res && res.status === 200) {
				setPaygateList(res.data.map((item: any) => {
					return {value: item.id, label: item.name};
				}));
			}
			
		});
	}, []);
	return (
		<NavTemplate listLinks={listLink} title={'Payout'}>
			<div>
				<ComboboxSingleSelect data={paygateList} onValueChange={onValueChange} placeholder={'Select payment '}/>
				<div>
					{balances.map((balance: any, index) => (
						<div key={index}>
							<p>Available Balance: {balance.available_balance} {balance.id.currency}</p>
							<p>Hold Balance: {balance.hold_balance} {balance.id.currency}</p>
						</div>
					))}
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onError)} className="w-2/3 space-y-6">
						<FormField
							disabled={selectedPayGate === ""}
							control={form.control}
							name="note"
							render={({field}) => (
								<FormItem>
									<FormLabel>Note</FormLabel>
									<FormControl>
										<Input placeholder="Note" {...field}  />
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							disabled={selectedPayGate === ""}
							control={form.control}
							name="emailSubject"
							render={({field}) => (
								<FormItem>
									<FormLabel>Email Subject</FormLabel>
									<FormControl>
										<Input placeholder="Email Subject" {...field}  />
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							disabled={selectedPayGate === ""}
							control={form.control}
							name="emailMessage"
							render={({field}) => (
								<FormItem>
									<FormLabel>Email Message</FormLabel>
									<FormControl>
										<Input placeholder="Email Message" {...field}  />
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<div className="flex space-x-4 items-center mt-0 ">
							<FormField
								disabled={selectedPayGate === ""}
								control={form.control}
								name="email"
								render={({field}) => (
									<FormItem className="w-1/2">
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="a@gmail.com" {...field} />
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<FormField
								disabled={selectedPayGate === ""}
								control={form.control}
								name={`amount`}
								render={({field}) => (
									<FormItem className="w-1/2">
										<FormLabel>Amount</FormLabel>
										<FormControl>
											<Input step="0.01" type="number" placeholder="amount" {...field}  />
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
						</div>
						{isLoading ? (<Button className="bg-sky-600 hover:bg-sky-600" disabled>
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
								Please wait
							</Button>) :
							<Button className="bg-sky-600 hover:bg-sky-600" disabled={selectedPayGate === ""} type="submit">
								Send Now
							</Button>
						}
					</form>
				</Form>
				
				<Toaster/>
			</div>
		</NavTemplate>
	);
}