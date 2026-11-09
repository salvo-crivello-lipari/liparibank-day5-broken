import type { Account, Transaction } from '../../../types';

const BASE_URL = 'http://localhost:3001';

export const fetchAccounts = async (signal?: AbortSignal): Promise<Account[]> => {
  const response = await fetch(`${BASE_URL}/accounts`, { signal });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData as { message?: string }).message ?? `Errore HTTP ${response.status}`);
  }
  return response.json();
};

export const fetchAccountById = async (id: string, signal?: AbortSignal): Promise<Account> => {
  const response = await fetch(`${BASE_URL}/accounts/${id}`, { signal });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message ?? `Conto non trovato (HTTP ${response.status})`
    );
  }
  return response.json();
};

export const fetchTransactions = async (
  accountId: string,
  limit: number,
  signal?: AbortSignal
): Promise<Transaction[]> => {
  const url = `${BASE_URL}/transactions?accountId=${accountId}&_limit=${limit}&_sort=date&_order=desc`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Errore HTTP ${response.status}`);
  }
  return response.json();
};
