import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useEffect, useState} from "react";
import {ComboboxSingleSelect} from "@/components/ComboBoxSingleSelect.tsx";
import {getPaymentGateList} from "@/service/PaymentGate.tsx";
import {createRefund} from "@/service/Refund.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {toast} from "@/components/ui/use-toast.ts";


export function CreateRefundWithOutCheck({isDialogOpen, setIsDialogOpen, onResponse}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	onResponse?: (reload: number) => void;
}) {
	const [loading, setLoading] = useState(false);
	const [paygateList, setPaygateList] = useState<[]>([]);
	const [transactionIDSearch, setTransactionIDSearch] = useState('')
	const [payGateSelected, setPayGateSelected] = useState<string>('');
	const [amountRefund, setAmountRefund] = useState('')
	const [reasonRefund, setReasonRefund] = useState('')
	useEffect(() => {
		getPaymentGateList(500, 0).then((res) => {
			if (res && res.status === 200) {
				setPaygateList(res.data.content.map((item: any) => {
					return {value: item.id, label: item.name.trim()};
				}));
			}
		});
	}, [isDialogOpen]);
	
	const onValueChange = async (value: string) => {
		setPayGateSelected(value);
	};
	const refund = async () => {
		setLoading(true);
		try {
			const response = await createRefund(transactionIDSearch, parseFloat(amountRefund), payGateSelected, reasonRefund, false);
			if (response && response.status === 200) {
				toast({
					title: "Refund Success",
					description: "Refund success amount: " + response.data.amount,
				});
				onResponse && onResponse(1);
				setIsDialogOpen(false);
			} else {
				toast({
					variant: "destructive",
					title: "Refund Failed",
					description: response?.data.message,
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Refund Failed",
				description: JSON.stringify(error),
			});
		} finally {
			setLoading(false);
		}
	}
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[925px]">
				<DialogHeader>
					<DialogTitle>Create refund (No Check)</DialogTitle>
					<DialogDescription>
						Only Dispute check
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<ComboboxSingleSelect data={paygateList} onValueChange={onValueChange} placeholder={'Select payment '}/>
					<div className="grid grid-cols-5 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Transaction ID
						</Label>
						<Input id="transactionID" value={transactionIDSearch} onChange={(event) => {
							setTransactionIDSearch(event.target.value)
						}} className="col-span-3"/>
					</div>
					<div className="grid grid-cols-5 items-center gap-4">
						<Label className="text-right">
							Amount
						</Label>
						<Input id="name" value={amountRefund} type="number" step="0.01"
						       className="col-span-3"
						       onChange={(event) => {
							       setAmountRefund(event.target.value)
						       }}
						/>
					</div>
					<div className="grid grid-cols-5 items-center gap-4">
						<Label className="text-right">
							Reason
						</Label>
						<Input value={reasonRefund} id="username" className="col-span-3"
						       onChange={(event) => {
							       setReasonRefund(event.target.value)
						       }}
						/>
					</div>
				</div>
				
				<DialogFooter>
					{loading ? (
						<Button disabled>
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
							Please wait
						</Button>
					) : (
						<Button disabled={payGateSelected === undefined} onClick={refund}
						        className="bg-sky-600 hover:bg-sky-700" type="submit">Refund</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	
	)
}