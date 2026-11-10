import { useEffect, useMemo } from 'react';
import type { Transaction } from '../../../../types';
import styles from './TransactionList.module.css';
import { useApi } from '../../../../core/api/useApi';

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
	const { data, isLoading, error, execute } = useApi<Transaction[]>(
		`http://localhost:3001/transactions?accountId=${accountId}&_limit=${filters.limit}&_sort=date&_order=desc`,
	);

	useEffect(() => {
		const ctrl = new AbortController();

		(async () => await execute(ctrl.signal))();

		return () => ctrl.abort();
	}, [onDataLoaded, execute]);

	const transactions = useMemo(() => {
		if (!data) return [];
		return filters.type === 'all' ? data : data.filter((tx) => tx.type === filters.type);
	}, [data, filters.type]);

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

	if (error) {
		return (
			<div className={`${styles.container} ${styles.errorState}`}>
				<span>⚠️</span>
				<p>{error}</p>
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
								<span className={`${styles.amount} ${tx.type === 'credit' ? styles.amountCredit : styles.amountDebit}`}>
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
