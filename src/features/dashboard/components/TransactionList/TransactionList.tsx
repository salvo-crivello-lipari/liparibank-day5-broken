import { useState, useEffect } from 'react';
import type { Transaction } from '../../../../types';
import styles from './TransactionList.module.css';

interface Filters {
  type: 'all' | 'credit' | 'debit';
  limit: number;
}

interface TransactionListProps {
  accountId: string;
  filters: Filters;
  onDataLoaded: (count: number) => void;
}

const TransactionList = ({ accountId, filters, onDataLoaded }: TransactionListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);

    fetch(
      `http://localhost:3001/transactions?accountId=${accountId}&_limit=${filters.limit}&_sort=date&_order=desc`
    )
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        const filtered =
          filters.type === 'all'
            ? data
            : data.filter((tx) => tx.type === filters.type);
        setTransactions(filtered);
        setIsLoading(false);
        onDataLoaded(filtered.length);
      })
      .catch(() => {
        setFetchError('Impossibile caricare i movimenti.');
        setIsLoading(false);
      });
  }, [accountId, filters, onDataLoaded]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingHeader} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow} />
        ))}
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={`${styles.container} ${styles.errorState}`}>
        <span>⚠️</span>
        <p>{fetchError}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Movimenti recenti</h3>
        <span className={styles.count}>{transactions.length} operazioni</span>
      </div>

      {transactions.length === 0 ? (
        <p className={styles.empty}>Nessun movimento trovato per i filtri selezionati.</p>
      ) : (
        <ul className={styles.list}>
          {transactions.map((tx) => (
            <li key={tx.id} className={styles.item}>
              <div className={styles.left}>
                <span className={`${styles.badge} ${styles[tx.type]}`}>
                  {tx.type === 'credit' ? 'Accredito' : 'Addebito'}
                </span>
                <span className={styles.description}>{tx.description}</span>
                <span className={styles.category}>{tx.category}</span>
              </div>
              <div className={styles.right}>
                <span
                  className={`${styles.amount} ${
                    tx.type === 'credit' ? styles.amountCredit : styles.amountDebit
                  }`}
                >
                  {tx.type === 'credit' ? '+' : '−'} {formatCurrency(tx.amount)}
                </span>
                <span className={styles.date}>{formatDate(tx.date)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
