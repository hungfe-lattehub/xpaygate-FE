import {useForm} from "react-hook-form";
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
import {provideSupportingInfo} from "@/service/Dispute.tsx"; // Assuming you have a service to handle this
import {useState} from "react";
import {ReloadIcon} from "@radix-ui/react-icons";
import {toast} from "@/components/ui/use-toast.ts";
import {FileInput} from "@/components/FileInput.tsx";

interface FormValues {
	note: string;
	file?: FileList;
}

export function DialogProvideSupportingInfo({isDialogOpen, setIsDialogOpen, disputeID, onResponse}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	disputeID: string;
	onResponse?: (data: Dispute) => void;
}) {
	const {register, handleSubmit, formState: {errors}} = useForm<FormValues>();
	const [loading, setLoading] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
	
	const onSubmit = async (data: FormValues) => {
		try {
			setLoading(true);
			const response = await provideSupportingInfo(disputeID, data.note, selectedFiles || data.file);
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
			// Display error message to the user
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Provide Supporting Info</DialogTitle>
					<DialogDescription>
						[{disputeID}] Provide Supporting Info to this case
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
							<FileInput register={register} onFilesChange={setSelectedFiles}/>
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
	);
}