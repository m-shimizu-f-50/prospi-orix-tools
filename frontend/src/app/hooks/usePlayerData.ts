import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Batter, Pitcher, PlayerApiResponse } from '@/app/types/player';
import { fetchPlayers } from '@/app/api/players';

/**
 * 選手データ取得用のカスタムフック（TanStack Query版）
 *
 * 機能:
 * - TanStack Queryを使用した選手一覧データの取得
 * - 自動キャッシュ、背景更新、エラーハンドリング
 * - APIレスポンスをUI用の形式に変換
 *
 * TanStack Queryの利点:
 * - 自動キャッシュ（5分間）
 * - 背景での自動更新
 * - リトライ機能
 * - ローディング状態の自動管理
 * - 開発者ツールでのデバッグ
 *
 * @returns {object} 選手データ、ローディング状態、エラー状態、再取得関数
 */
export const usePlayerData = () => {
	// TanStack Queryを使用してデータを取得
	const {
		data: playersData,
		isLoading,
		error,
		refetch,
		isError,
	} = useQuery({
		queryKey: ['players'], // キャッシュのキー
		queryFn: fetchPlayers, // データ取得関数
		staleTime: 5 * 60 * 1000, // 5分間はデータが新鮮とみなす
		gcTime: 10 * 60 * 1000, // 10分後にキャッシュから削除
		retry: 1, // エラー時のリトライ回数
	});

	/**
	 * APIレスポンスをUI用のBatter型に変換
	 */
	const convertToBatter = (player: PlayerApiResponse): Batter => ({
		id: player.id,
		name: player.name,
		position: player.position,
		spirit: player.spirit,
		limit_break: player.limit_break,
		average: player.average || 0,
		homerun: 0, // APIに含まれていない場合は0で初期化（後で修正予定）
		rbi: 0, // APIに含まれていない場合は0で初期化（後で修正予定）
		trajectory: player.trajectory, // 弾道
		skill1: player.skill1,
		skill2: player.skill2,
		skill3: player.skill3,
	});

	/**
	 * APIレスポンスをUI用のPitcher型に変換
	 */
	const convertToPitcher = (player: PlayerApiResponse): Pitcher => ({
		id: player.id,
		name: player.name,
		type: player.position, // 投手の場合はpositionがタイプを表す
		spirit: player.spirit,
		limit_break: player.limit_break,
		era: player.era || 0,
		strikeouts: 0, // APIに含まれていない場合は0で初期化（後で修正予定）
		games: 0, // APIに含まれていない場合は0で初期化（後で修正予定）
		skill1: player.skill1,
		skill2: player.skill2,
		skill3: player.skill3,
	});

	/**
	 * データが変更された時のみ再計算するためにuseMemoを使用
	 * パフォーマンス最適化のため
	 */
	const { batters, pitchers } = useMemo(() => {
		if (!playersData) {
			return { batters: [], pitchers: [] };
		}

		// レスポンスデータを野手と投手に分類
		const batterData = playersData
			.filter((player) => player.type === 'batter')
			.map(convertToBatter);

		const pitcherData = playersData
			.filter((player) => player.type === 'pitcher')
			.map(convertToPitcher);

		return {
			batters: batterData,
			pitchers: pitcherData,
		};
	}, [playersData]);

	return {
		batters,
		pitchers,
		loading: isLoading, // TanStack QueryのisLoadingを使用
		error: isError ? error?.message || '不明なエラーが発生しました' : null,
		refetch, // TanStack Queryのrefetch関数をそのまま返す
	};
};
