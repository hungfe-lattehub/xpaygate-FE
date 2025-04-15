import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {convertToDispute, Dispute} from "@/type/Dispute.tsx";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {escalate} from "@/service/Dispute.tsx";
import {ReloadIcon} from "@radix-ui/react-icons";
import {toast} from "@/components/ui/use-toast.ts";

interface FormValues {
	note: string;
}

export function DialogEscalate({isDialogOpen, setIsDialogOpen, disputeID, onResponse}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	disputeID: string;
	onResponse?: (data: Dispute) => void;
}) {
	const {register, handleSubmit, formState: {errors}} = useForm<FormValues>();
	const [loading, setLoading] = useState(false);
	
	const onSubmit = async (data: FormValues) => {
		try {
			setLoading(true);
			const response = await escalate(disputeID, data.note);
			if (response) {
				const dispute = convertToDispute(response.data);
				onResponse && onResponse(dispute);
				if (response.status === 200) {
					toast({
						title: "Success",
						description: "Submit success",
					})
				} else {
					toast({
						title: "Error",
						description: "[Submit failed] " + response.data.message,
					})
				}
			}
			setIsDialogOpen(false);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Escalate</DialogTitle>
					<DialogDescription>
						[{disputeID}] Escalating to PayPal claim for resolution
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-4 py-4">
						<div className="grid w-full gap-1.5">
							<Label htmlFor="note">Note</Label>
							<Textarea
								placeholder="Type your message here."
								id="note"
								{...register("note", {required: "Note is required"})}
							/>
							{errors.note && <span className="text-red-600">{errors.note.message}</span>}
						</div>
					</div>
					<DialogFooter>
						{loading ? (
							<Button disabled>
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
								Please wait
							</Button>
						) : (
							<Button className="bg-sky-600 hover:bg-sky-700" type="submit">Submit</Button>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}