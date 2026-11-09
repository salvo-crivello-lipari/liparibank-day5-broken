import { useState, useEffect } from 'react';
import { fetchAccounts } from './services/accountService';
import AccountCard from './components/AccountCard/AccountCard';
import TransactionList from './components/TransactionList/TransactionList';
import type { Account } from '../../types';
import styles from './DashboardPage.module.css';

const INVALID_ACCOUNT_ID = 'acc-999';

const DashboardPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('acc-001');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>('—');

  useEffect(() => {
    const ctrl = new AbortController();
    fetchAccounts(ctrl.signal)
      .then(setAccounts)
      .catch((err: Error) => {
        if (err.name !== 'AbortError') console.error('Accounts fetch error:', err.message);
      });
    return () => ctrl.abort();
  }, []);

  const filters = {
    type: filterType,
    limit: 20,
  };

  const handleDataLoaded = (count: number) => {
    setLastUpdatedAt(new Date().toLocaleTimeString('it-IT'));
    console.log(`Loaded ${count} transactions at ${new Date().toLocaleTimeString('it-IT')}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Dati aggiornati alle: <strong>{lastUpdatedAt}</strong>
          </p>
        </div>
      </div>

      <div className={styles.accountTabs}>
        {accounts.map((acc) => (
          <button
            key={acc.id}
            className={`${styles.accountTab} ${selectedAccountId === acc.id ? styles.active : ''}`}
            onClick={() => setSelectedAccountId(acc.id)}
          >
            {acc.name}
          </button>
        ))}
        <button
          className={`${styles.accountTab} ${selectedAccountId === INVALID_ACCOUNT_ID ? styles.active : ''} ${styles.invalidTab}`}
          onClick={() => setSelectedAccountId(INVALID_ACCOUNT_ID)}
          title="Conto di test — verificare gestione errori"
        >
          Conto Premium ✦
        </button>
      </div>

      <AccountCard accountId={selectedAccountId} />

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Filtra per tipo:</span>
        {(['all', 'credit', 'debit'] as const).map((t) => (
          <button
            key={t}
            className={`${styles.filterBtn} ${filterType === t ? styles.filterActive : ''}`}
            onClick={() => setFilterType(t)}
          >
            {t === 'all' ? 'Tutti' : t === 'credit' ? 'Accrediti' : 'Addebiti'}
          </button>
        ))}
      </div>

      <TransactionList
        accountId={selectedAccountId}
        filters={filters}
        onDataLoaded={handleDataLoaded}
      />
    </div>
  );
};

export default DashboardPage;
