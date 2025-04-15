import {useForm} from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {convertToDispute, Dispute} from "@/type/Dispute";
import {useState} from "react";
import {ReloadIcon} from "@radix-ui/react-icons";
import DropdownMenuTemplate from "@/components/DropdownTemplate";
import {Input} from "@/components/ui/input";
import {provideEvidence} from "@/service/Dispute.tsx";
import {toast} from "@/components/ui/use-toast.ts";
import {FileInput} from "@/components/FileInput.tsx";

interface FormValues {
	note: string;
	file?: FileList;
	tracking?: string;
	refundTransactionID?: string;
}

export function DiaLogProvideEvidence({
	                                      isDialogOpen,
	                                      setIsDialogOpen,
	                                      disputeID,
	                                      onResponse
                                      }: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	disputeID: string;
	onResponse?: (data: Dispute) => void;
}) {
	const {register, handleSubmit, formState: {errors}} = useForm<FormValues>();
	const [loading, setLoading] = useState(false);
	const [typeEvidence, setTypeEvidence] = useState('PROOF_OF_FULFILLMENT');
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
	
	const onSubmit = async (data: FormValues) => {
		try {
			setLoading(true);
			const response = await provideEvidence(disputeID, data.note, typeEvidence, selectedFiles || data.file,
				data.tracking, data.refundTransactionID);
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
		} catch (e: any) {
			let errorMessage = "An internal server error occurred. Please try again later.";
			if (e.response && e.response.data) {
				try {
					const errorResponse = JSON.parse(e.response.data.message);
					const errorDetails = errorResponse.details && errorResponse.details.map((detail: any) => detail.issue).join(', ');
					errorMessage = errorDetails || errorResponse.message || errorMessage;
				} catch (parseError) {
					// Parsing failed, use generic error message
					console.error('Failed to parse error response:', parseError);
				}
			}
			
			// Display error message to the user
			toast({
				title: "Error",
				description: errorMessage,
			});
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
							<Label htmlFor="evidenceType">Evidence Type</Label>
							<div className="w-1/2">
								<DropdownMenuTemplate options={
									[
										{label: "Proof Of Fulfillment", value: "PROOF_OF_FULFILLMENT", default: true},
										{label: "Proof Of Refund", value: "PROOF_OF_REFUND"},
										{label: "Other", value: "OTHER"},
									]
								}
								                      title="Evidence type" onValueChange={setTypeEvidence}/>
							</div>
							{typeEvidence === 'PROOF_OF_FULFILLMENT' && <>
                  <Label htmlFor="tracking">Tracking( ex: 123456 | USPS)</Label>
                  <Input
                      placeholder="Tracking number | Tracking provider"
                      id="tracking"
											{...register("tracking", {required: "Tracking is required"})}
                  />
								{errors.tracking && <span className="text-red-600">{errors.tracking.message}</span>}
              </>}
							{typeEvidence === 'PROOF_OF_REFUND' && <>
                  <Label htmlFor="refundTransactionID">Refund transactionID</Label>
                  <Textarea
                      placeholder="Transaction ID of the refund"
                      id="refundTransactionID"
											{...register("refundTransactionID", {required: "Transaction ID is required"})}
                  />
								{errors.refundTransactionID &&
                    <span className="text-red-600">{errors.refundTransactionID.message}</span>}
              </>}
							<Label htmlFor="note">Notes</Label>
							<Textarea
								placeholder="Type your notes here."
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
