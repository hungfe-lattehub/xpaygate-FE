import { useForm } from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { counterDispute } from "@/service/Dispute.tsx";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { convertToDispute, Dispute } from "@/type/Dispute.tsx";
import { toast } from "@/components/ui/use-toast.ts";

interface DialogSendMessageProps {
	isDialogOpen: boolean;
	setIsDialogOpen: (open: boolean) => void;
	disputeID: string;
	onResponse?: (data: Dispute) => void;
}

interface FormValues {
	productType: string;
	productDescription?: string;
	trackingNumber?: string;
	trackingCarrier?: string;
	shippingAddress?: string;
	shippingDate?: string;
	cancellationPolicy?: FileList;
	customerCommunication?: FileList;
	customerSignature?: FileList;
	duplicateChargeDocumentation?: FileList;
	receipt?: FileList;
	refundPolicy?: FileList;
	serviceDocumentation?: FileList;
	shippingDocumentation?: FileList;
	uncategorizedFile?: FileList;
	additionalInfo?:string;
}

export function DialogSubmitEvidenceStripe({
	                                           isDialogOpen,
	                                           setIsDialogOpen,
	                                           disputeID,
	                                           onResponse,
                                           }: DialogSendMessageProps) {
	const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
	const [loading, setLoading] = useState(false);
	
	const productType = watch("productType");
	
	const onSubmit = async (data: FormValues) => {
		const files = {
			cancellationPolicy: data.cancellationPolicy,
			customerCommunication: data.customerCommunication,
			customerSignature: data.customerSignature,
			duplicateChargeDocumentation: data.duplicateChargeDocumentation,
			receipt: data.receipt,
			refundPolicy: data.refundPolicy,
			serviceDocumentation: data.serviceDocumentation,
			shippingDocumentation: data.shippingDocumentation,
			uncategorizedFile: data.uncategorizedFile,
		};
		
		try {
			setLoading(true);
			const response = await counterDispute(
				disputeID,
				data.trackingNumber,
				data.trackingCarrier,
				data.productDescription,
				data.shippingAddress,
				data.shippingDate,
				files,
				data.additionalInfo
			);
			if (response && response.data) {
				const dispute = convertToDispute(response.data);
				onResponse && onResponse(dispute);
				if (response.status === 200) {
					toast({
						title: "Success",
						description: "Submit success",
					});
				} else {
					toast({
						title: "Error",
						description: "[Submit failed] " + response.data.message,
					});
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
					<DialogTitle>Counter dispute</DialogTitle>
					<DialogDescription>
						[{disputeID}] Submit evidence to counter dispute
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-4 py-4">
						<div className="grid w-full gap-1.5">
							<Label htmlFor="productType">Product Type</Label>
							<select id="productType" {...register("productType")} className="input border-2">
								<option value="physical">Physical</option>
								<option value="digital">Digital</option>
							</select>
							{errors.productType && <span className="text-red-600">{errors.productType.message}</span>}
							
							<Label htmlFor="productDescription">Product Description</Label>
							<Input id="productDescription" type="text" {...register("productDescription")} />
							{errors.productDescription && <span className="text-red-600">{errors.productDescription.message}</span>}
							
							{productType === "physical" && (
								<>
									<div className="flex gap-4">
										<div className="flex-1">
											<Label htmlFor="trackingNumber">Tracking Number</Label>
											<Input id="trackingNumber" type="text" {...register("trackingNumber")} />
											{errors.trackingNumber && <span className="text-red-600">{errors.trackingNumber.message}</span>}
										</div>
										<div className="flex-1">
											<Label htmlFor="trackingCarrier">Tracking Carrier</Label>
											<Input id="trackingCarrier" type="text" {...register("trackingCarrier")} />
											{errors.trackingCarrier && <span className="text-red-600">{errors.trackingCarrier.message}</span>}
										</div>
									</div>
									
									<Label htmlFor="shippingAddress">Shipping Address</Label>
									<Input id="shippingAddress" type="text" {...register("shippingAddress")} />
									{errors.shippingAddress && <span className="text-red-600">{errors.shippingAddress.message}</span>}
									
									<Label htmlFor="shippingDate">Shipping Date</Label>
									<Input id="shippingDate" type="date" {...register("shippingDate")} />
									{errors.shippingDate && <span className="text-red-600">{errors.shippingDate.message}</span>}
								</>
							)}
							
							<Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
							<Input id="cancellationPolicy" type="file" accept=".pdf,.jpeg,.png" {...register("cancellationPolicy")} />
							{errors.cancellationPolicy && <span className="text-red-600">{errors.cancellationPolicy.message}</span>}
							
							<Label htmlFor="customerCommunication">Customer Communication</Label>
							<Input id="customerCommunication" type="file" accept=".pdf,.jpeg,.png" {...register("customerCommunication")} />
							{errors.customerCommunication && <span className="text-red-600">{errors.customerCommunication.message}</span>}
							
							<Label htmlFor="customerSignature">Customer Signature</Label>
							<Input id="customerSignature" type="file" accept=".pdf,.jpeg,.png" {...register("customerSignature")} />
							{errors.customerSignature && <span className="text-red-600">{errors.customerSignature.message}</span>}
							
							<Label htmlFor="duplicateChargeDocumentation">Duplicate Charge Documentation</Label>
							<Input id="duplicateChargeDocumentation" type="file" accept=".pdf,.jpeg,.png" {...register("duplicateChargeDocumentation")} />
							{errors.duplicateChargeDocumentation && <span className="text-red-600">{errors.duplicateChargeDocumentation.message}</span>}
							
							<Label htmlFor="receipt">Receipt</Label>
							<Input id="receipt" type="file" accept=".pdf,.jpeg,.png" {...register("receipt")} />
							{errors.receipt && <span className="text-red-600">{errors.receipt.message}</span>}
							
							<Label htmlFor="refundPolicy">Refund Policy</Label>
							<Input id="refundPolicy" type="file" accept=".pdf,.jpeg,.png" {...register("refundPolicy")} />
							{errors.refundPolicy && <span className="text-red-600">{errors.refundPolicy.message}</span>}
							
							<Label htmlFor="serviceDocumentation">Service Documentation</Label>
							<Input id="serviceDocumentation" type="file" accept=".pdf,.jpeg,.png" {...register("serviceDocumentation")} />
							{errors.serviceDocumentation && <span className="text-red-600">{errors.serviceDocumentation.message}</span>}
							
							<Label htmlFor="shippingDocumentation">Shipping Documentation</Label>
							<Input id="shippingDocumentation" type="file" accept=".pdf,.jpeg,.png" {...register("shippingDocumentation")} />
							{errors.shippingDocumentation && <span className="text-red-600">{errors.shippingDocumentation.message}</span>}
							
							<Label htmlFor="uncategorizedFile">Uncategorized File</Label>
							<Input id="uncategorizedFile" type="file" accept=".pdf,.jpeg,.png" {...register("uncategorizedFile")} />
							{errors.uncategorizedFile && <span className="text-red-600">{errors.uncategorizedFile.message}</span>}
							<Label htmlFor="productDescription">Additional Info</Label>
							<Input id="additionalInfo" type="text" {...register("additionalInfo")} />
						</div>
					</div>
					<DialogFooter>
						{loading ? (
							<Button disabled>
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</Button>
						) : (
							<Button className="bg-sky-600 hover:bg-sky-700" type="submit">
								Submit
							</Button>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
