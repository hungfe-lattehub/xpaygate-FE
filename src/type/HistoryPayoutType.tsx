export type PayoutItemType = {
  id: string;
  email: string;
  amount: string;
  currency: string;
  status: string;
  createdAt: string;
};

export type HistoryPayoutType = {
  id: number;
  payoutId: string;
  payGateId: string;
  payGateName: string;
  payoutDate: string;
  error: null | string;
  status: string;
	note: string;
  payoutItems: PayoutItemType[];
};