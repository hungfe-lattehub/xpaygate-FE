export interface Dispute {
	id: string;
	payGateName: string;
	payGateType: string;
	transactionId: string;
	transactionDescription: string;
	transactionCreatedAt: string;
	createdAt: string;
	status: string;
	reason: string;
	amount: string;
	responseDeadline: string;
	type: string;
	customerEmail: string;
	evidence: Evidence[];
	message: Message[];
	supportingInfo: SupportingInfo[];
	actions: string[];
	transactionResponse:TransactionResponse
	listDocument:DocumentInternal[]
}
export interface TransactionResponse {
	id: string
	payGateId: number
	payGateName: string
	payGateType: string
	type: string
	typeDescription: string
	note: string
	createdAt: string
	amount: string
	fee: string
	netAmount: string
	currency: string
	status: string
	description: string
	customerEmail: string
	source: string
	namePayer: string
	address: string
}

interface TrackingInfo {
	carrier_name: string;
	carrier_name_other?: string;
	tracking_number: string;
}

interface EvidenceInfo {
	tracking_info?: TrackingInfo[];
}

export interface Evidence {
	date: string;
	notes?: string;
	evidence_type: string;
	source: string;
	dispute_life_cycle_stage: string;
	documents?: Document[];
	tracking_info?: TrackingInfo[];
	evidence_info?: EvidenceInfo; // Add this line
}

export interface Message {
	posted_by: string;
	time_posted: string;
	content: string;
	documents?: Document[];
}

interface Document {
	name: string;
	url: string;
}
interface DocumentInternal{
	name: string;
	id: number;
}

interface SupportingInfo {
	notes: string;
	documents?: Document[];
	source: string;
	provided_time: string;
}

export function convertToDispute(data: any): Dispute {
	data.evidence = JSON.parse(data.evidence) as Evidence[];
	data.message = JSON.parse(data.message) as Message[];
	data.supportingInfo = JSON.parse(data.supportingInfo) as SupportingInfo[];

		data.actions = data.actions && data.actions.split(",");
	return data;
}