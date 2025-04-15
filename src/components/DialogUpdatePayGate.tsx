import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Paygate} from "@/type/Paygate.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {updatePaymentGate} from "@/service/PaymentGate.tsx";
import {toast} from "@/components/ui/use-toast.ts";

// Define the form schema
const FormSchema = z.object({
	name: z.string(),
	groupName: z.string(),
	email: z.string().email(),
	domain: z.string(),
	holdStatus: z.string(),
	limitStatus: z.string()
});

export function DialogUpdatePayGate({isDialogOpen, setIsDialogOpen, payGate, setReloadKey}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	payGate: Paygate;
	setReloadKey: (key: number) => void;
}) {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: payGate.name,
			groupName: payGate.groupName,
			email: payGate.email,
			domain: payGate.domain,
			limitStatus: payGate.limitStatus,
			holdStatus: payGate.holdStatus
		},
	});
	
	function onSubmit(data: z.infer<typeof FormSchema>) {
		payGate.name = data.name;
		payGate.groupName = data.groupName;
		payGate.email = data.email;
		payGate.holdStatus = data.holdStatus;
		payGate.domain = data.domain;
		payGate.limitStatus = data.limitStatus;
		updatePaymentGate(payGate).then((response) => {
			setIsDialogOpen(false);
			if (response && response.status === 200) {
				toast({
					title: "Create Payment Gate Success",
					description: `${response.data.name} has been created successfully!`,
				})
				setReloadKey(Date.now());
			} else {
				toast({
					variant: "destructive",
					title: "Update Payment Gate Failed",
					description: `Failed to update payment gate!`,
				})
			}
		}).catch((error) => {
			toast({
				variant: "destructive",
				title: "Error",
				description: `Error: ${error}`,
			})
		});
	}
	
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[625px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({field}) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="groupName"
							render={({field}) => (
								<FormItem>
									<FormLabel>Group Name</FormLabel>
									<FormControl>
										<Input placeholder="Group Name" {...field} />
									</FormControl>
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
										<Input placeholder="Email" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="domain"
							render={({field}) => (
								<FormItem>
									<FormLabel>Domain</FormLabel>
									<FormControl>
										<Input placeholder="..." {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="holdStatus"
							render={({field}) => (
								<FormItem>
									<FormLabel>Hold Status</FormLabel>
									<FormControl>
										<Input placeholder="..." {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="limitStatus"
							render={({field}) => (
								<FormItem>
									<FormLabel>Limit Status</FormLabel>
									<FormControl>
										<Input placeholder="..." {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<Button type="submit">Update</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}