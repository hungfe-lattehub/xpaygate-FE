import {
	Dialog,
	DialogContent
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Dispute} from "@/type/Dispute.tsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {toast} from "@/components/ui/use-toast.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod"
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {AUTHORITIES} from "@/service/utils.tsx";
import {changeAuthorize} from "@/service/User.tsx";

const FormSchema = z.object({
	items: z.array(z.string()),
});

export function DialogUpdatePermission({isDialogOpen, setIsDialogOpen, userID, userEmail, permission}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	userID: string;
	userEmail: string;
	permission: string[];
	onResponse?: (data: Dispute) => void;
}) {
	
	
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			items: permission,
		},
	})
	
	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(data)
		const authorities = AUTHORITIES.filter(authority => {
			return data.items.includes(authority.name);
		}).flatMap(authority => authority.value);
		changeAuthorize(userID, authorities).then((response) => {
			if (response.status === 200) {
				toast({
					title: "Success",
					description: "Change permission success!",
				})
			} else {
				toast({
					title: "Error",
					description: "[Submit failed] " + response.data.message,
				})
			}
			setIsDialogOpen(false);
		});
	}
	
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[625px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="items"
							render={() => (
								<FormItem>
									<div className="mb-4">
										<FormLabel className="text-base">Change Permission {userEmail}</FormLabel>
									</div>
									<div className="grid grid-cols-2 gap-4">
										{AUTHORITIES.map((item) => (
											<FormField
												key={item.name}
												control={form.control}
												name="items"
												render={({field}) => {
													return (
														<FormItem
															key={item.name}
															className="flex flex-row items-start space-x-3 space-y-0"
														>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(item.name)}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange([...field.value, item.name])
																			: field.onChange(
																				field.value?.filter(
																					(value) => value !== item.name
																				)
																			)
																	}}
																/>
															</FormControl>
															<FormLabel className="text-sm font-normal">
																{item.name}
															</FormLabel>
														</FormItem>
													)
												}}
											/>
										))}
									</div>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
