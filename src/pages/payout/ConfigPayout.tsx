import {ListLink, NavTemplate} from "@/components/NavTemplate.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm, useFieldArray} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {CirclePlus, Trash2} from "lucide-react";
import {toast} from "@/components/ui/use-toast.ts";
import {useCallback, useEffect, useState} from "react";
import {getAllPayPalPaymentGate} from "@/service/PaymentGate.tsx";
import {createOrUpdateConfigPayout, getConfigPayoutById} from "@/service/ConfigPayout.tsx";
import {ConfigEmail} from "@/type/ConfigPayoutType.tsx";
import {ConfigPayoutType} from "@/type/ConfigPayoutType.tsx";
import {useLocation} from "react-router-dom";
import {ComboboxSingleSelect} from "@/components/ComboBoxSingleSelect.tsx";

const listLink: ListLink[] = [
	{href: "/payout", text: "Manage Payout"},
	{href: "/payout/config", text: "Config Payout", primary: true},
	{href: "/payout/history", text: "History"},
	{href: "/payout/send", text: "Payout Now"},
];

const formSchema = z.object({
	threshold: z.coerce.number().positive({message: "Threshold must be greater than 0"}),
	emails: z.array(
		z.object({
			id: z.number().optional(),
			email: z.string().email(),
			percent: z.coerce.number().positive({message: "Percent must be greater than 0"}),
		})
	).refine(data => data.reduce((acc, cur) => acc + cur.percent, 0) <= 100, {
		message: "Total percent must be less than or equal to 100%",
	}),
	note: z.string().min(1, {message: "Note is required"}),
	emailSubject: z.string().min(1, {message: "Email Subject is required"}),
	emailMessage: z.string().min(1, {message: "Email Message is required"}),
});

export function ConfigPayout() {
	const [paygateList, setPaygateList] = useState([]);
	const [selectedPayGate, setSelectedPayGate] = useState("")
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const payGateId = queryParams.get('payGateId');
	const onValueChange = useCallback(
		async (value: string) => {
			setSelectedPayGate(value);
		},
		[setSelectedPayGate]
	);
	useEffect(() => {
		if (selectedPayGate === "") return;
		
		const fetchData = async () => {
			try {
				const response = await getConfigPayoutById(selectedPayGate);
				if (response && response.status === 200 && response.data !== null) {
					const data = response.data;
					form.setValue('note', data.note);
					form.setValue('emailSubject', data.emailSubject);
					form.setValue('emailMessage', data.emailMessage);
					form.setValue('threshold', data.threshold);
					form.setValue('emails', data.configEmails.map((email: ConfigEmail) => ({
						id: email.id,
						email: email.email,
						percent: email.percent
					})));
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};
		fetchData();
	}, [selectedPayGate]);
	useEffect(() => {
		getAllPayPalPaymentGate().then((res) => {
			if (res && res.status === 200) {
				setPaygateList(res.data.map((item: any) => {
					return {value: item.id.toString(), label: item.name};
				}));
			}
			
		});
	}, []);
	useEffect(() => {
		if (payGateId !== undefined && payGateId !== "" && payGateId !== null)
			onValueChange(payGateId);
	}, [payGateId]);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			threshold: 0,
			emails: [{email: "", percent: 0}],
			note: "Thanks you for use my service",
			emailSubject: "You have a payout",
			emailMessage: "You have received a payout! Thanks for using our service!",
		},
	});
	
	const {fields, append, remove} = useFieldArray({
		control: form.control,
		name: "emails",
	});
	
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const configPayout: ConfigPayoutType = {
			...values,
			payGateId: selectedPayGate,
			configEmails: values.emails.map(email => ({id: email.id, email: email.email, percent: email.percent}))
		};
		const response = await createOrUpdateConfigPayout(configPayout);
		if (response && response.status === 200) {
			toast({
				title: "Success",
				description: "Config Payout has been updated successfully",
			});
		} else {
			toast({
				variant: "destructive",
				title: "Failed",
				description: "Failed to update Config Payout",
			});
		}
		
	};
	const onError = (errors: any) => {
		if (form.formState.errors.emails) {
			toast({
				variant: "destructive",
				title: "Please check again",
				description: errors.emails.root.message,
			})
		}
	};
	
	return (
		<NavTemplate listLinks={listLink} title={'Payout'}>
			<div>
				<ComboboxSingleSelect data={paygateList} onValueChange={onValueChange} placeholder={'Select payment '}/>
				{/*<DropdownMenuTemplate options={paygateList} title={'Payment Gate'} onValueChange={onValueChange}/>*/}
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
						<FormField
							disabled={selectedPayGate === ""}
							control={form.control}
							name="threshold"
							render={({field}) => (
								<FormItem>
									<FormLabel>Threshold</FormLabel>
									<FormControl>
										<Input type="number" placeholder="Threshold" {...field}  />
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<Button type="button" className="bg-green-600 hover:bg-green-600 " disabled={selectedPayGate === ""}
						        onClick={() => append({email: "", percent: 0})}><CirclePlus className="mr-2 h-4 w-4"/> Add
							email</Button>
						{fields.map((field, index) => (
							<div key={field.id} className="flex space-x-4 items-center mt-0">
								<FormField
									disabled={selectedPayGate === ""}
									control={form.control}
									name={`emails.${index}.email`}
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
									name={`emails.${index}.percent`}
									render={({field}) => (
										<FormItem className="w-1/2">
											<FormLabel>Percent(%)</FormLabel>
											<FormControl>
												<Input type="number" placeholder="%" {...field}  />
											</FormControl>
											<FormMessage/>
										</FormItem>
									)}
								/>
								{index !== 0 &&
                    <Button className="mt-7 bg-red-600 hover:bg-red-600" type="button"
                            onClick={() => remove(index)}><Trash2/></Button>}
							</div>
						))}
						<Button className="bg-sky-600 hover:bg-sky-600" disabled={selectedPayGate === ""}
						        type="submit">Submit</Button>
					</form>
				</Form>
			</div>
			<Toaster/>
		</NavTemplate>
	);
}
