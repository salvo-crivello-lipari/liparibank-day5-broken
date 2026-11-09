export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'corrente' | 'deposito' | 'investimenti';
  iban: string;
  owner: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  category: string;
}
