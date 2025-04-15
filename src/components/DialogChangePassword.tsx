import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {changePassword} from "@/service/User.tsx";

const FormSchema = z.object({
	currentPassword: z.string(),
	newPassword: z.string(),
	confirmationPassword: z.string()
}).refine(data =>
		data.confirmationPassword === data.newPassword,
	{
		message: "Confirm password and new password must match",
	}
);

export function DialogChangePassword({isDialogOpen, setIsDialogOpen}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
}) {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})
	const [error, setError] = useState<string>()
	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		changePassword(data.currentPassword, data.newPassword, data.confirmationPassword).then((response) => {
			if (response && response.status === 200) {
				setIsDialogOpen(false)
			} else {
				setError("Change password failed");
			}
		})
	}
	const onError = (errors: any) => {
		setError(errors[""].message)
	};
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[625px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
						<FormField
							control={form.control}
							name="currentPassword"
							render={({field}) => (
								<FormItem>
									<FormLabel>Old Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="Old Password" {...field} />
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="newPassword"
							render={({field}) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="New Password" {...field} />
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmationPassword"
							render={({field}) => (
								<FormItem>
									<FormLabel>Confirm New Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="Confirm New Password" {...field} />
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						{error && <div className="text-red-600">{error}</div>}
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}