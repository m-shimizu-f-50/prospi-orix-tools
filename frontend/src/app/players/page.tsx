'use client';

import PlayerTable from '../components/player/PlayerTable';
import { usePlayerData } from '../hooks/usePlayerData';

/**
 * 選手一覧ページコンポーネント
 *
 * 責任:
 * - 選手データの取得とエラーハンドリング
 * - PlayerTableコンポーネントにデータを渡す
 * - ページレベルのレイアウト管理
 */
export default function Players() {
	// カスタムフックで選手データを取得
	const { batters, pitchers, loading, error, refetch } = usePlayerData();

	return (
		<main className='p-6'>
			<h1 className='text-xl font-bold mb-4'>選手一覧</h1>

			{/* 選手テーブルコンポーネントにデータを渡す */}
			<PlayerTable
				batters={batters}
				pitchers={pitchers}
				loading={loading}
				error={error}
				onRefresh={refetch}
			/>
		</main>
	);
}
