export type PayoutRequest = {
  payGateId: string;
  note: string;
  emailSubject: string;
  emailMessage: string;
  email: string;
  amount: number;
  currency: string;
};