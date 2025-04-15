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
import {useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {findTransactionByID} from "@/service/TransactionService.tsx";
import {createRefund} from "@/service/Refund.tsx";
import {toast} from "@/components/ui/use-toast";
import {format} from "date-fns";

interface Transaction {
	transactionID: string;
	amount: number;
	payGateName: string;
	payGateId: string;
}

interface History {
	amount: number;
	userAction: string;
	createdAt: string;
}

interface Dispute {
	id: string
	amount: number,
	status: string,
}

interface Balance {
	id: {
		currency: string,
	},
	available_balance: number,
	hold_balance: number,
}

export function CreateRefund({isDialogOpen, setIsDialogOpen, onResponse}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	onResponse?: (reload: number) => void;
}) {
	const [loading, setLoading] = useState(false);
	const [transaction, setTransaction] = useState<Transaction>()
	const [transactionIDSearch, setTransactionIDSearch] = useState('')
	const [isTransactionFound, setIsTransactionFound] = useState(true)
	const [amountRefund, setAmountRefund] = useState('')
	const [reasonRefund, setReasonRefund] = useState('')
	const [history, setHistory] = useState<History[]>([])
	const [dispute, setDispute] = useState<Dispute[]>([])
	const [balances, setBalances] = useState<Balance[]>([])
	const [remainAmount, setRemainAmount] = useState(0)
	const findTransaction = async () => {
		try {
			const response = await findTransactionByID(transactionIDSearch);
			if (response && response.status === 200 && response.data) {
				setTransaction(response.data);
				// setAmountRefund(response.data.amount.toString())
				setHistory(response.data.refunds)
				setDispute(response.data.disputes)
				setBalances(response.data.balances);
				const remain = response.data.amount - response.data.refunds.reduce((acc: number, item: History) => acc + parseFloat(item.amount.toString()), 0);
				setAmountRefund(remain.toString());
				setRemainAmount(remain)
			}
			if (response && response.status !== 200) {
				setIsTransactionFound(false)
			}
		} catch (e) {
			setIsTransactionFound(false)
			console.error(e);
		}
	}
	const refund = async () => {
		setLoading(true)
		if (transaction)
			try {
				const response = await createRefund(transactionIDSearch, parseFloat(amountRefund), transaction.payGateId, reasonRefund,true);
				if (response)
					if (response.data) {
						setLoading(false)
						setIsDialogOpen(false)
						onResponse && onResponse(Date.now())
						setTransactionIDSearch('')
						setAmountRefund('')
						setReasonRefund('')
						setHistory([])
						setDispute([])
						setBalances([]);
						toast({
							title: "Refund Success",
							description: "Refund success amount: " +response.data.amount ,
						});
					} else {
						toast({
							variant: "destructive",
							title: "Refund Failed",
							description: response.data.message,
						});
					}
			} catch (e) {
				toast({
					variant: "destructive",
					title: "Refund Error",
					description: JSON.stringify(e),
				});
			}
	}
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[925px]">
				<DialogHeader>
					<DialogTitle>Create refund</DialogTitle>
					<DialogDescription>
						Find transactionID and create refund.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-5 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Transaction ID
						</Label>
						<Input id="transactionID" value={transactionIDSearch} onChange={(event) => {
							setTransactionIDSearch(event.target.value)
						}} className="col-span-3"/>
						<Button onClick={findTransaction} className="col-span-1">Find</Button>
					</div>
				</div>
				{transaction?.amount &&
            <div className="grid gap-4 py-4">
                <div className="grid gap-4">
                    <table className="bg-white border border-gray-200 w-full">
                        <thead>
                        <tr className="bg-[#204998] text-white text-left ">
                            <th>
                                Transaction Amount: <b>${transaction.amount}</b>
                            </th>
                            <th>
                                Payment Gateway: <b>{transaction.payGateName}</b>
                            </th>
                            <th>
															{balances.map((balance, index) => (
																<div key={index}>
																	<b>Available: {balance.available_balance} {balance.id.currency}</b>
																	<b> Hold: {balance.hold_balance} {balance.id.currency}</b>
																</div>
															))}
                            </th>
                        </tr>
												{history.length > 0 &&
                            <tr className="border-t">
                                <th colSpan={3}>Refund History</th>
                            </tr>}
												{history.length > 0 &&
                            <tr className="border-t text-left">
                                <th>Amount</th>
                                <th>User</th>
                                <th>Time</th>
                            </tr>}
                        </thead>
											{history.length > 0 &&
                          <tbody className="text-left">
													{history.map((item, index) => (
														<tr key={index} className="border-t hover:bg-[#2fa1da] ">
															<td>{item.amount}</td>
															<td>{item.userAction}</td>
															<td>{format(new Date(item.createdAt), 'hh:mm dd-MM-yyyy')}</td>
														</tr>
													))}
                          </tbody>}
											{dispute.length > 0 &&
                          <tr>
                              <th colSpan={3}>Dispute</th>
                          </tr>
											}
											{dispute.length > 0 &&
												dispute.map((item, index) => (
													<tr key={index} className="border-t hover:bg-[#2fa1da] ">
														<td><a href={'/dispute/paypal/' + item.id}>{item.id}</a></td>
														<td>{item.amount}</td>
														<td>{item.status}</td>
													</tr>
												))
											}

                    </table>
                </div>

                <div className="grid grid-cols-5 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Amount
                    </Label>
                    <Input id="name" value={amountRefund} type="number" step="0.01" max={transaction.amount}
                           className="col-span-3"
                           onChange={(event) => {
											       setAmountRefund(event.target.value)
										       }}
                    />
                </div>
                <div className="grid grid-cols-5 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Reason
                    </Label>
                    <Input value={reasonRefund} id="username" className="col-span-3"
                           onChange={(event) => {
											       setReasonRefund(event.target.value)
										       }}
                    />
                </div>
            </div>
				}
				{!isTransactionFound && <div className="text-red-500">Transaction not found</div>}
				{<div className="text-red-500">Remain amount: {remainAmount}</div>}
				<DialogFooter>
					{loading ? (
						<Button disabled>
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
							Please wait
						</Button>
					) : (
						<Button disabled={remainAmount <= 0 || dispute.length > 0} onClick={refund}
						        className="bg-sky-600 hover:bg-sky-700" type="submit">Refund</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}