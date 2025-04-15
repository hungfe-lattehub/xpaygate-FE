import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {convertToDispute, Dispute} from "@/type/Dispute";
import {useState} from "react";
import {ReloadIcon} from "@radix-ui/react-icons";

import {requireEvidence} from "@/service/Dispute.tsx";
import {toast} from "@/components/ui/use-toast.ts";

export function DialogRequireEvidence({isDialogOpen, setIsDialogOpen, disputeID, onResponse}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	disputeID: string;
	onResponse?: (data: Dispute) => void;
}) {
	const [loading, setLoading] = useState(false);
	
	const onSubmit = async () => {
		try {
			setLoading(true);
			const response = await requireEvidence(disputeID);
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
					<DialogTitle>Request Evidence from Buyer</DialogTitle>
					<DialogDescription>
						[{disputeID}] Request Evidence from Buyer
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					{loading ? (
						<Button disabled>
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
							Please wait
						</Button>
					) : (
						<Button onClick={onSubmit} className="bg-sky-600 hover:bg-sky-700" type="submit">Submit</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
		;
}
