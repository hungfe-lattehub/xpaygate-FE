import {
	Dialog,
	DialogContent
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Dispute} from "@/type/Dispute.tsx";
import {
	Form,
	FormControl,
	FormDescription,
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
import {useEffect, useState} from "react";
import {getPaymentGateList} from "@/service/PaymentGate.tsx";
import {assignPaygate} from "@/service/User.tsx";
import {ComboboxSingleSelect} from "@/components/ComboBoxSingleSelect.tsx";

const FormSchema = z.object({
	items: z.array(z.string()),
});

interface PayGate {
	id: string;
	name: string;
	type: string;
	groupName: string;
}
interface GroupOption {
	value: string;
	label: string;
}

export function DialogAssignPayGate({isDialogOpen, setIsDialogOpen, userID, userName, userEmail, paygateIDs}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	userID: string;
	userName: string;
	userEmail: string;
	paygateIDs: string[];
	onResponse?: (data: Dispute) => void;
}) {
	const [paygateList, setPaygateList] = useState<PayGate[]>([]);
	const [filteredPaygateList, setFilteredPaygateList] = useState<PayGate[]>([]);
	const [selectAll, setSelectAll] = useState(false);
	const [groupList, setGroupList] = useState<{ value: string, label: string }[]>([]);
	
	useEffect(() => {
		if (isDialogOpen) {
			getPaymentGateList(500, 0).then((response) => {
				if (response) {
					const updatedPaygateList = response.data.content.map((item: PayGate) => ({
						...item,
						id: String(item.id),
					}));
					setPaygateList(updatedPaygateList);
					setFilteredPaygateList(updatedPaygateList);  // Initialize filtered list with all items
					
					const uniqueGroups: GroupOption[] = Array.from(new Set(updatedPaygateList.map((item:PayGate) => item.groupName)))
						.map((groupName) => ({
							value: groupName as string,  // Explicitly assert type here
							label: groupName as string,  // Explicitly assert type here
						}));
					setGroupList(uniqueGroups);
					
				}
			}).catch((error) => {
				console.error(error);
			});
		}
	}, [userID]);
	
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			items: paygateIDs,
		},
	})
	
	const toggleSelectAll = () => {
		const currentSelections = form.getValues("items");
		const currentGroupIds = filteredPaygateList.map((pg) => pg.id);
		
		let updatedSelections;
		if (selectAll) {
			// Deselect all items from the current group
			updatedSelections = currentSelections.filter(id => !currentGroupIds.includes(id));
		} else {
			// Select all items from the current group and keep selections from other groups
			updatedSelections = Array.from(new Set([...currentSelections, ...currentGroupIds]));
		}
		
		form.setValue("items", updatedSelections);
		setSelectAll(!selectAll);
	};
	
	function onSubmit(data: z.infer<typeof FormSchema>) {
		assignPaygate(userID, data.items).then((response) => {
			if (response.status === 200) {
				toast({
					title: "Success",
					description: "Assign payment gate success",
				})
				setIsDialogOpen(false);
			} else {
				toast({
					title: "Error",
					description: "[Assign payment gate failed] " + response.data.message,
				})
			}
		}).catch((error) => {
			console.error(error);
			toast({
				title: "Error",
				description: "Assign payment gate failed " + error.message,
			})
		})
	}
	
	const onchangeGroup = (value: string | null) => {
		let paygateListByGroup;
		
		if (value === null || value === "") {
			paygateListByGroup = paygateList;  // Show all items if value is null
		} else {
			paygateListByGroup = paygateList.filter((item) => item.groupName === value);
		}
		
		setFilteredPaygateList(paygateListByGroup);  // Update filtered list based on group selection
		
		// Update the select all state
		const currentSelections = form.getValues("items");
		const allGroupSelected = paygateListByGroup.every(pg => currentSelections.includes(pg.id));
		setSelectAll(allGroupSelected);
	}
	
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[1900px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="items"
							render={() => (
								<FormItem>
									<div className="mb-4">
										<FormLabel className="text-base">Assign Payment Gates to {userEmail}</FormLabel>
										<FormDescription>
											Select Payment gates to assign to {userName}
										</FormDescription>
										<ComboboxSingleSelect data={groupList} onValueChange={onchangeGroup} placeholder={'Group name'}/>
									</div>
									<div className="flex justify-end mb-4">
										<Button type="button" onClick={toggleSelectAll}>
											{selectAll ? "Deselect All" : "Select All"}
										</Button>
									</div>
									<div className="grid grid-cols-5 gap-4">
										{filteredPaygateList.map((item) => (
											<FormField
												key={item.id}
												control={form.control}
												name="items"
												render={({field}) => {
													return (
														<FormItem
															key={item.id}
															className="flex flex-row items-start space-x-3 space-y-0"
														>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(item.id)}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange([...field.value, item.id])
																			: field.onChange(
																				field.value?.filter((value) => value !== item.id)
																			);
																	}}
																/>
															</FormControl>
															<FormLabel className="text-sm font-normal">
																{item.name}
															</FormLabel>
														</FormItem>
													);
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
