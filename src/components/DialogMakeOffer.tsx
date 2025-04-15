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
import {makeOffer} from "@/service/Dispute.tsx"; // Assuming you have a service to handle this
import {useState} from "react";
import {ReloadIcon} from "@radix-ui/react-icons";
import {toast} from "@/components/ui/use-toast.ts";
import DropdownMenuTemplate from "@/components/DropdownTemplate.tsx";
import {Input} from "@/components/ui/input.tsx";

interface FormValues {
	note: string;
	amount: number;
}

export function DialogMakeOffer({isDialogOpen, setIsDialogOpen, disputeID, onResponse, amount}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	disputeID: string;
	onResponse?: (data: Dispute) => void;
	amount: number;
}) {
	const {register, handleSubmit, formState: {errors}} = useForm<FormValues>();
	const [loading, setLoading] = useState(false);
	const [typeEvidence, setTypeEvidence] = useState('REFUND');
	const [amountRefund, setAmountRefund] = useState(amount)
	const onSubmit = async (data: FormValues) => {
		try {
			console.log(data)
			setLoading(true);
			const response = await makeOffer(disputeID, data.amount, data.note, typeEvidence);
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
					<DialogTitle>Make Offer - Dispute amount : {amount}</DialogTitle>
					<DialogDescription>
						[{disputeID}] Make an offer to the buyer to resolve the dispute.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-4 py-4">
						<div className="w-1/2">
							<DropdownMenuTemplate options={
								[
									{label: "Refund", value: "REFUND", default: true},
									{label: "Refund with replacement", value: "REFUND_WITH_REPLACEMENT"},
									{label: "Replacement without refund", value: "REPLACEMENT_WITHOUT_REFUND"},
								]
							}
							                      title="Offer: " onValueChange={setTypeEvidence}/>
						</div>
						{typeEvidence !== 'REPLACEMENT_WITHOUT_REFUND' && <div className="grid w-full gap-1.5">
                <Label htmlFor="note">Amount</Label>
                <Input
                    type={"number"}
                    placeholder="Amount refund"
                    id="amount"
                    step={0.01}
                    value={amountRefund}
										{...register("amount", { required: "Amount is required" })}
                    onChange={(e) => setAmountRefund(parseFloat(e.target.value))}
                />
            </div>}
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
		;
}