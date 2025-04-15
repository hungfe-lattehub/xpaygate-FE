import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {downloadDocument, getDisputeDetail, reloadData} from "@/service/Dispute";
import {Separator} from "@/components/ui/separator.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DialogAcceptClaim} from "@/components/DialogAcceptClaim.tsx";
import {DialogEscalate} from "@/components/DialogEscalate.tsx";
import {DialogSendMessage} from "@/components/DialogSendMessage.tsx";
import {DialogProvideSupportingInfo} from "@/components/DialogProvideSupportingInfo.tsx";
import {convertToDispute, Dispute} from "@/type/Dispute.tsx";
import {DiaLogProvideEvidence} from "@/components/DialogProvideEvidence.tsx";
import {DialogAdjudicate} from "@/components/DialogAdjudicate.tsx";
import {DialogRequireEvidence} from "@/components/DialogRequireEvidence.tsx";
import {ReloadIcon} from "@radix-ui/react-icons";
import {Toaster} from "@/components/ui/toaster.tsx";
import {DialogAppeal} from "@/components/DialogAppeal.tsx";
import {DialogMakeOffer} from "@/components/DialogMakeOffer.tsx";
import {ArrowDownToLine} from "lucide-react";

export function DisputeDetailPayPal() {
	const {id} = useParams();
	const [dispute, setDispute] = useState<Dispute>();
	const [loading, setLoading] = useState(false);
	
	function formatStatus(status: string): string {
		return status
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
	
	const [isDialogAcceptClaimOpen, setIsDialogAcceptClaimOpen] = useState(false);
	const [isDialogMakeOffer, setIsDialogMakeOfferOpen] = useState(false);
	const [isDialogEscalateOpen, setIsDialogEscalateOpen] = useState(false);
	const [isDialogSendMessageOpen, setIsDialogSendMessageOpen] = useState(false);
	const [isDialogProvideSupportingInfoOpen, setIsDialogProvideSupportingInfoOpen] = useState(false);
	const [isDialogProvideEvidenceOpen, setIsDialogProvideEvidenceOpen] = useState(false);
	const [isDialogAdjudicateOpen, setisDialogAdjudicateOpen] = useState(false);
	const [isDialogRequireEvidenceOpen, setIsDialogRequireEvidenceOpen] = useState(false);
	const [isDialogAppealOpen, setisDialogAppealOpen] = useState(false);
	
	useEffect(() => {
		if (id) {
			getDisputeDetail(id).then((result) => {
				if (result) {
					const data = convertToDispute(result.data);
					console.log(data.listDocument);
					setDispute(data);
				}
			});
		}
	}, [id]);
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
	
	function handleDocumentDownload(id: string, name: string) {
		if (id)
			downloadDocument(id, name);
	}
	
	return (
		<div className="text-neutral-600 max-w-[100%] mx-auto pt-10 h-screen overflow-y-auto custom-scrollbar">
			<div className="pl-8 pb-10 w-[95%]">
				<div className="flex h-5 items-center justify-between ">
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
					<h1 className="text-lg font-medium leading-none">Dispute amount : {dispute.amount}</h1>
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
				<div className="flex h-5 items-center space-x-4 text-sm">
					{dispute.transactionResponse && <>
              <div>Transaction amount : {<b>{dispute.transactionResponse.amount}</b>}</div>
              <Separator orientation="vertical"/>
              <div>Email: <b> {dispute.transactionResponse.customerEmail}</b></div>
              <Separator orientation="vertical"/>
              <div>Name: <b>{dispute.transactionResponse.namePayer}</b></div>
              <Separator orientation="vertical"/>
              <div>Address: <b>{dispute.transactionResponse.address}</b></div>
              <Separator orientation="vertical"/>
          </>}
					<div>
						Tracking: <b>
						{dispute.evidence && dispute.evidence.length > 0
							? dispute.evidence
								.filter(evidence => evidence.evidence_type === 'PROOF_OF_FULFILLMENT')
								.map(evidence => evidence.evidence_info?.tracking_info?.map(info => `${info.carrier_name_other || info.carrier_name}: ${info.tracking_number}`).join(', '))
								.join(', ')
							: 'No tracking information available'}
					</b>
					</div>
				</div>
				<Separator className="my-4"/>
				<div className="flex h-5 items-center space-x-4 pt-5">
					{dispute.actions &&
						dispute.actions.map((action, index) => {
							let onClickHandler = undefined;
							if (action === '') return;
							if (action === 'make_offer') {
								onClickHandler = () => setIsDialogMakeOfferOpen(true);
							}
							if (action === 'accept_claim') {
								onClickHandler = () => setIsDialogAcceptClaimOpen(true);
							}
							if (action === 'escalate') {
								onClickHandler = () => setIsDialogEscalateOpen(true);
							}
							if (action === 'send_message') {
								onClickHandler = () => setIsDialogSendMessageOpen(true);
							}
							if (action === 'provide_supporting_info') {
								onClickHandler = () => setIsDialogProvideSupportingInfoOpen(true);
							}
							if (action === 'provide_evidence') {
								onClickHandler = () => setIsDialogProvideEvidenceOpen(true);
							}
							if (action === 'adjudicate') {
								onClickHandler = () => setisDialogAdjudicateOpen(true);
							}
							if (action === 'require_evidence') {
								onClickHandler = () => setIsDialogRequireEvidenceOpen(true);
							}
							if (action === 'appeal') {
								onClickHandler = () => setisDialogAppealOpen(true);
							}
							return (
								<Button
									key={index}
									onClick={onClickHandler}
									size="sm"
									className="text-sm bg-sky-600 hover:bg-sky-700"
								>
									{formatStatus(action)}
								</Button>
							);
						})
					}
				</div>
				{Object.keys(dispute.listDocument).length > 0 && <div className="my-10">
            <h1 className="text-2xl mb-4">List Document Uploaded</h1>
            <div className="flex flex-wrap -mx-2">
							{Object.entries(dispute.listDocument).map(([id, name]) => ({id, name}))
								.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between p-2 border rounded-md bg-gray-100 w-3/12 px-3 py-3 mb-3 mr-3"
									>
										<span className="text-sm text-gray-700">{item.name.toString()}</span>
										<ArrowDownToLine onClick={() => handleDocumentDownload(item.id, item.name.toString())}/>
									</div>
								))}
            </div>
        </div>}
				
				
				{dispute.evidence && <div className="my-10">
            <h1 className="text-2xl">Evidence</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Evidence Type</TableHead>
                        <TableHead>Date </TableHead>
                        <TableHead>Source </TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>File</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
									{dispute.evidence.map((evidence, index) => (
										<TableRow key={index}>
											<TableCell>{evidence.evidence_type}</TableCell>
											<TableCell>{evidence.date} </TableCell>
											<TableCell> {formatStatus(evidence.source)}</TableCell>
											<TableCell>{evidence.notes}</TableCell>
											<TableCell>
												{evidence.documents && evidence.documents.length > 0 ? (
													<ul>
														{evidence.documents.map((doc, index) => (
															<li key={index} className="underline text-blue-700">
																{doc.name}
															</li>
														))}
													</ul>
												) : (
													""
												)}
											</TableCell>
										</TableRow>
									))}
                </TableBody>
            </Table>
        </div>}
				{dispute.message && <div className="my-10">
            <h1 className="text-2xl">Message</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Posted By</TableHead>
                        <TableHead>Time Posted</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>File</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
									{dispute.message.map((message, index) => (
										<TableRow key={index}>
											<TableCell>{message.posted_by}</TableCell>
											<TableCell>{message.time_posted}</TableCell>
											<TableCell>{message.content}</TableCell>
											<TableCell>
												{message.documents && message.documents.length > 0 ? (
													<ul>
														{message.documents.map((doc, index) => (
															<li key={index} className="underline text-blue-700">
																{doc.name}
															</li>
														))}
													</ul>
												) : (
													""
												)}
											</TableCell>
										</TableRow>
									))}
                </TableBody>
            </Table>
        </div>}
				{dispute.supportingInfo && <div className="my-10">
            <h1 className="text-2xl">Supporting Info</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Time Posted</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>File Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
									{dispute.supportingInfo.map((message, index) => (
										<TableRow key={index}>
											<TableCell>{message.source}</TableCell>
											<TableCell>{message.provided_time}</TableCell>
											<TableCell>{message.notes}</TableCell>
											<TableCell>{message.documents?.map((doc) => doc.name).join(", ")}</TableCell>
										</TableRow>
									))}
                </TableBody>
            </Table>
        </div>}
				<DialogMakeOffer disputeID={dispute.id} isDialogOpen={isDialogMakeOffer}
				                 setIsDialogOpen={setIsDialogMakeOfferOpen} onResponse={setDispute}
				                 amount={parseInt(dispute.amount)}/>
				<DialogAcceptClaim disputeID={dispute.id} isDialogOpen={isDialogAcceptClaimOpen}
				                   setIsDialogOpen={setIsDialogAcceptClaimOpen} onResponse={setDispute}/>
				<DialogEscalate isDialogOpen={isDialogEscalateOpen} setIsDialogOpen={setIsDialogEscalateOpen}
				                disputeID={dispute.id} onResponse={setDispute}/>
				<DialogSendMessage isDialogOpen={isDialogSendMessageOpen} setIsDialogOpen={setIsDialogSendMessageOpen}
				                   disputeID={dispute.id} onResponse={setDispute}/>
				<DialogProvideSupportingInfo isDialogOpen={isDialogProvideSupportingInfoOpen}
				                             setIsDialogOpen={setIsDialogProvideSupportingInfoOpen}
				                             disputeID={dispute.id} onResponse={setDispute}/>
				<DiaLogProvideEvidence isDialogOpen={isDialogProvideEvidenceOpen}
				                       setIsDialogOpen={setIsDialogProvideEvidenceOpen}
				                       disputeID={dispute.id} onResponse={setDispute}/>
				<DialogAdjudicate isDialogOpen={isDialogAdjudicateOpen}
				                  setIsDialogOpen={setisDialogAdjudicateOpen}
				                  disputeID={dispute.id} onResponse={setDispute}/>
				<DialogRequireEvidence isDialogOpen={isDialogRequireEvidenceOpen}
				                       setIsDialogOpen={setIsDialogRequireEvidenceOpen}
				                       disputeID={dispute.id} onResponse={setDispute}/>
				<DialogAppeal isDialogOpen={isDialogAppealOpen} setIsDialogOpen={setisDialogAppealOpen}
				              disputeID={dispute.id} onResponse={setDispute}/>
				<Toaster/>
			</div>
		</div>
	);
}
