import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {convertToDispute, Dispute} from "@/type/Dispute.tsx";
import {getDisputeDetail, reloadData} from "@/service/Dispute.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ReloadIcon} from "@radix-ui/react-icons";
import {Separator} from "@/components/ui/separator.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {DialogSubmitEvidenceStripe} from "@/components/DialogSubmitEvidenceStripe.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";

export function DisputeDetailStripe() {
	const {id} = useParams();
	const [dispute, setDispute] = useState<Dispute>();
	const [loading, setLoading] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	
	useEffect(() => {
		if (id) {
			getDisputeDetail(id).then((result) => {
				if (result) {
					const data = convertToDispute(result.data);
					console.log(data);
					setDispute(data);
				}
			});
		}
	}, [id]);
	
	function formatStatus(status: string): string {
		return status
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
	
	const reloadDispute = () => {
		if (id) {
			setLoading(true);
			reloadData(id).then((result) => {
					if (result) {
						const data = convertToDispute(result.data);
						setDispute(data);
						setLoading(false);
					}
				}
			)
		}
	}
	if (!dispute) {
		return <div>Loading...</div>;
	}
	const onClickHandler = () => {
		setIsDialogOpen(true)
	}
	return (
		<div>
			<div className="text-neutral-600 max-w-[95%] mx-auto pt-10">
				<div className="flex h-5 items-center justify-between">
					<h1 className="text-2xl font-medium leading-none">{dispute.id}</h1>
					{loading ? (
							<Button disabled>
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
								Please wait
							</Button>
						) :
						<Button onClick={reloadDispute}>Reload Data Dispute</Button>}
				</div>
				
				<Separator className="my-4"/>
				<div className="flex h-5 items-center space-x-4 text-lg">
					<p className="text-sm text-muted-foreground">
						Created at <b>{dispute.createdAt}</b> by <b>{dispute.payGateName}</b>
					</p>
					<Separator orientation="vertical"/>
					<h1 className="text-lg font-medium leading-none">{dispute.amount}</h1>
					<Separator orientation="vertical"/>
					{dispute.responseDeadline &&
              <h1 className="text-lg font-medium leading-none">Response before: {dispute.responseDeadline}</h1>}
				</div>
				<Separator className="my-4"/>
				<div className="flex h-5 items-center space-x-4 text-sm">
					<div>Status: <b>{formatStatus(dispute.status)}</b></div>
					<Separator orientation="vertical"/>
					<div>Reason: <b> {formatStatus(dispute.reason)}</b></div>
					<Separator orientation="vertical"/>
					<div>Type: <b>{dispute.type}</b></div>
					<Separator orientation="vertical"/>
					<div>transactionId: <b>{dispute.transactionId}</b></div>
					<Separator orientation="vertical"/>
					<div>transaction desc: <b>{dispute.transactionDescription}</b></div>
				</div>
				<Separator className="my-4"/>
				{dispute.status === 'needs_response' && <Button
            onClick={onClickHandler}
            size="sm"
            className="text-sm bg-sky-600 hover:bg-sky-700"
        >
            Counter Dispute
        </Button>}
				{dispute.evidence && <div className="my-10">
            <h1 className="text-2xl">Evidence</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Key</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
									{Object.entries(dispute.evidence).map(([key, value], index) => (
										value && (
											<TableRow key={index}>
												<TableCell>{key}</TableCell>
												<TableCell>{JSON.stringify(value)}</TableCell>
											</TableRow>
										)
									))}
                </TableBody>
            </Table>
        </div>}
			</div>
			<DialogSubmitEvidenceStripe setIsDialogOpen={setIsDialogOpen} disputeID={dispute.id} isDialogOpen={isDialogOpen}
			                            onResponse={setDispute}/>
			<Toaster />
		</div>
	);
}
