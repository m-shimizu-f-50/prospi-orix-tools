import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
	fetchTournamentData,
	updatePlayerStats,
	fetchTournament,
} from '@/app/api/tournaments';
import {
	TournamentData,
	PlayerStats,
	TournamentBatter,
	TournamentPitcher,
} from '@/app/types/tournament';

/**
 * 大会データ取得用のカスタムフック（バッター/ピッチャー分離版）
 *
 * 機能:
 * - 大会の包括的データを取得（ランク戦、カップ戦、リーグ戦など）
 * - 大会情報、選手情報、成績を一括取得
 * - TanStack Queryによる自動キャッシュと更新
 * - usePlayerDataと同じような形式でバッターとピッチャーに分ける
 *
 * @param tournamentId - 大会ID
 * @returns バッター、ピッチャー、ローディング状態、エラー状態、再取得関数
 */
export const useTournamentData = (tournamentId: number) => {
	// TanStack Queryを使用してデータを取得
	const {
		data: tournamentData,
		isLoading,
		error,
		refetch,
		isError,
	} = useQuery({
		queryKey: ['tournament', 'data', tournamentId],
		queryFn: () => fetchTournamentData(tournamentId),
		staleTime: 2 * 60 * 1000, // 2分間キャッシュ（成績は頻繁に更新される）
		gcTime: 5 * 60 * 1000, // 5分後にガベージコレクション
		enabled: !!tournamentId, // tournamentIdが存在する場合のみ実行
	});

	/**
	 * 大会データをUI用のTournamentBatter型に変換
	 */
	const convertToTournamentBatter = (
		playerWithStats: TournamentData['playersWithStats'][0]
	): TournamentBatter => {
		const { player, stats } = playerWithStats;

		return {
			id: player.id, // 選手ID
			name: player.name, // 選手名
			position: player.position, // ポジション
			order: stats.order, // オーダー
			atBats: stats.atBats || 0,
			hits: stats.hits || 0,
			homeRuns: stats.homeRuns || 0,
			doubles: stats.doubles || 0,
			triples: stats.triples || 0,
			rbi: stats.rbi || 0,
		};
	};

	/**
	 * 大会データをUI用のTournamentPitcher型に変換
	 */
	const convertToTournamentPitcher = (
		playerWithStats: TournamentData['playersWithStats'][0]
	): TournamentPitcher => {
		const { player, stats } = playerWithStats;
		return {
			id: player.id,
			name: player.name,
			order: stats.order,
			position: player.position,
			wins: stats.wins || 0,
			losses: stats.losses || 0,
			saves: stats.saves || 0,
		};
	};

	/**
	 * データが変更された時のみ再計算するためにuseMemoを使用
	 * パフォーマンス最適化のため
	 */
	const { batters, pitchers, tournament, summary } = useMemo(() => {
		if (!tournamentData) {
			return {
				batters: [],
				pitchers: [],
				tournament: null,
				summary: null,
			};
		}

		// レスポンスデータを野手と投手に分類
		const batterData = tournamentData.playersWithStats
			.filter((playerWithStats) => playerWithStats.player.type === 'batter')
			.sort((a, b) => {
				// null を末尾に回す
				if (a.stats.order === null) return 1;
				if (b.stats.order === null) return -1;
				// 数値昇順(打順の順番にソート)
				return a.stats.order - b.stats.order;
			})
			.map(convertToTournamentBatter);

		const pitcherData = tournamentData.playersWithStats
			.filter((playerWithStats) => playerWithStats.player.type === 'pitcher')
			.map(convertToTournamentPitcher)
			.sort((a, b) => {
				// 並び順を定義
				// 1-5: 先発1~5
				// 6-11: 中継ぎ1~6
				// 12: 抑え
				// null: ベンチ（999番にする）
				const orderValue = (order: number | null) => {
					if (order == null) return 999; // ベンチを一番最後に
					if (order >= 1 && order <= 5) return order; // 先発1~5
					if (order >= 6 && order <= 11) return 100 + order; // 中継ぎ → 100番台
					if (order === 12) return 200; // 抑え
					return 999; // 不明 or ベンチ
				};

				return orderValue(a.order) - orderValue(b.order);
			});

		return {
			batters: batterData,
			pitchers: pitcherData,
			tournament: tournamentData.tournament,
			summary: tournamentData.summary,
		};
	}, [tournamentData]);

	return {
		batters,
		pitchers,
		tournament,
		summary,
		loading: isLoading, // TanStack QueryのisLoadingを使用
		error: isError ? error?.message || '不明なエラーが発生しました' : null,
		refetch, // TanStack Queryのrefetch関数をそのまま返す
	};
};

/**
 * 大会情報のみを取得するカスタムフック
 *
 * 用途: 軽量なデータ取得、個別更新
 *
 * @param tournamentId - 大会ID
 * @returns 大会情報とローディング状態
 */
export const useTournament = (tournamentId: number) => {
	return useQuery({
		queryKey: ['tournament', tournamentId],
		queryFn: () => fetchTournament(tournamentId),
		staleTime: 10 * 60 * 1000, // 10分間キャッシュ（大会情報は変更頻度が低い）
		enabled: !!tournamentId,
	});
};

/**
 * 選手成績のみを取得するカスタムフック
 *
 * 用途: 成績の個別更新、リアルタイム表示
 *
 * @param tournamentId - 大会ID
 * @returns 選手成績一覧とローディング状態
 */
// export const usePlayerStats = (tournamentId: number) => {
// 	return useQuery({
// 		queryKey: ['playerStats', tournamentId],
// 		queryFn: () => fetchPlayerStats(tournamentId),
// 		staleTime: 1 * 60 * 1000, // 1分間キャッシュ（成績は頻繁に更新）
// 		enabled: !!tournamentId,
// 	});
// };

/**
 * 選手成績更新用のmutationフック
 *
 * 機能:
 * - 選手成績の更新
 * - 関連キャッシュの自動無効化
 * - 楽観的更新のサポート
 *
 * @param tournamentId - 大会ID
 * @returns mutation関数とその状態
 */
export const useUpdatePlayerStats = (tournamentId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			playerId,
			stats,
		}: {
			playerId: number;
			stats: Partial<PlayerStats>;
		}) => updatePlayerStats(tournamentId, playerId, stats),

		// 楽観的更新
		onMutate: async ({ playerId, stats }) => {
			// 進行中のクエリをキャンセル
			await queryClient.cancelQueries({
				queryKey: ['tournament', 'data', tournamentId],
			});
			await queryClient.cancelQueries({
				queryKey: ['playerStats', tournamentId],
			});

			// 現在のデータを取得（ロールバック用）
			const previousTournamentData = queryClient.getQueryData<TournamentData>([
				'tournament',
				'data',
				tournamentId,
			]);
			const previousPlayerStats = queryClient.getQueryData<PlayerStats[]>([
				'playerStats',
				tournamentId,
			]);

			// 楽観的更新を実行
			if (previousTournamentData) {
				const updatedData = {
					...previousTournamentData,
					playersWithStats: previousTournamentData.playersWithStats.map(
						(item) =>
							item.player.id === playerId
								? { ...item, stats: { ...item.stats, ...stats } }
								: item
					),
				};
				queryClient.setQueryData(
					['tournament', 'data', tournamentId],
					updatedData
				);
			}

			if (previousPlayerStats) {
				const updatedStats = previousPlayerStats.map((stat) =>
					stat.playerId === playerId ? { ...stat, ...stats } : stat
				);
				queryClient.setQueryData(['playerStats', tournamentId], updatedStats);
			}

			// ロールバック用のデータを返す
			return { previousTournamentData, previousPlayerStats };
		},

		// エラー時のロールバック
		onError: (err, variables, context) => {
			if (context?.previousTournamentData) {
				queryClient.setQueryData(
					['tournament', 'data', tournamentId],
					context.previousTournamentData
				);
			}
			if (context?.previousPlayerStats) {
				queryClient.setQueryData(
					['playerStats', tournamentId],
					context.previousPlayerStats
				);
			}
		},

		// 成功時の最終的なデータ同期
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['tournament', 'data', tournamentId],
			});
			queryClient.invalidateQueries({
				queryKey: ['playerStats', tournamentId],
			});
		},
	});
};
