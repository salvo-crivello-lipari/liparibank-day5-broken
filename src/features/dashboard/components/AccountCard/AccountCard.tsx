import { useEffect } from 'react';
import { useApi } from '../../../../core/api/useApi';
import type { Account } from '../../../../types';
import styles from './AccountCard.module.css';

interface AccountCardProps {
  accountId: string;
}

const AccountCard = ({ accountId }: AccountCardProps) => {
  const { data: account, isLoading, error, execute } = useApi<Account>(
    `http://localhost:3001/accounts/${accountId}`
  );

  useEffect(() => {
    execute();
  }, [execute]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.card} ${styles.error}`}>
        <span className={styles.errorIcon}>⚠️</span>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!account) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.name}>{(account as Account).name ?? String(account)}</h3>
          <span className={styles.iban}>{(account as Account).iban ?? '—'}</span>
        </div>
        <span className={`${styles.typeBadge} ${styles[(account as Account).type ?? '']}`}>
          {(account as Account).type ?? 'sconosciuto'}
        </span>
      </div>
      <div className={styles.balanceRow}>
        <span className={styles.balanceLabel}>Saldo disponibile</span>
        <span className={styles.balanceValue}>
          {(account as Account).balance != null
            ? formatCurrency((account as Account).balance)
            : JSON.stringify(account)}
        </span>
      </div>
    </div>
  );
};

export default AccountCard;
