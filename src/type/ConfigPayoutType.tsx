export type ConfigEmail = {
	id?: number;
	configPayoutId?: number;
	email: string;
	percent: number;
};

export type ConfigPayoutType = {
	payGateId: string;
	payGateName?: string;
	note: string;
	emailSubject: string;
	emailMessage: string;
	configEmails: ConfigEmail[];
	threshold: number;
};