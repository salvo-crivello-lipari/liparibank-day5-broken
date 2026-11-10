import { useState, useCallback } from 'react';

interface UseApiResult<T> {
	data: T | null;
	isLoading: boolean;
	error: string | null;
	execute: (signal?: AbortSignal) => Promise<void>;
}

export function useApi<T>(url: string): UseApiResult<T> {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const execute = useCallback(
		async (signal?: AbortSignal) => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch(url, { signal });

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));

					throw new Error(errorData.message ?? `Errore HTTP ${response.status}`);
				}

				const json = await response.json();
				setData(json);
			} catch (err) {
				if (err instanceof Error && err.name === 'AbortError') return;

				setError(err instanceof Error ? err.message : 'Errore di connessione al server.');
			} finally {
				if (!signal?.aborted) {
					setIsLoading(false);
				}
			}
		},
		[url],
	);

	return { data, isLoading, error, execute };
}
