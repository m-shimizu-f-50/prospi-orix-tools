import {
	Tournament,
	PlayerStats,
	TournamentData,
} from '@/app/types/tournament';
import apiClient from '@/app/lib/axios';

/**
 * 大会の包括的データを取得するAPI関数
 *
 * 用途: 大会画面の初期表示（ランク戦、カップ戦、リーグ戦など）
 * 特徴: 一度のリクエストで必要なデータを全て取得
 *
 * @param tournamentId - 大会ID
 * @returns {Promise<TournamentData>} 大会の全データ
 */
export const fetchTournamentData = async (
	tournamentId: number
): Promise<any> => {
	try {
		const response = await apiClient.get(
			`/tournaments/${tournamentId}/details`
		);
		return response.data;
	} catch (error: any) {
		throw new Error(
			`大会データの取得に失敗しました: ${error.response?.status || 'Unknown'} ${
				error.message
			}`
		);
	}
};

/**
 * 大会情報のみを取得するAPI関数
 *
 * 用途: 大会情報の個別更新、軽量なデータ取得
 *
 * @param tournamentId - 大会ID
 * @returns {Promise<Tournament>} 大会情報
 */
export const fetchTournament = async (
	tournamentId: number
): Promise<Tournament> => {
	try {
		const response = await apiClient.get(`/tournaments/${tournamentId}`);
		return response.data;
	} catch (error: any) {
		throw new Error(
			`大会情報の取得に失敗しました: ${error.response?.status || 'Unknown'} ${
				error.message
			}`
		);
	}
};

/**
 * 特定の大会の選手成績のみを取得するAPI関数
 *
 * 用途: 成績の個別更新、リアルタイム更新
 *
 * @param tournamentId - 大会ID
 * @returns {Promise<PlayerStats[]>} 選手成績一覧
 */
// export const fetchPlayerStats = async (
// 	tournamentId: number
// ): Promise<PlayerStats[]> => {
// 	const response = await fetch(
// 		`${API_BASE_URL}/tournaments/${tournamentId}/player-stats`,
// 		{
// 			method: 'GET',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 		}
// 	);

// 	if (!response.ok) {
// 		throw new Error(
// 			`選手成績の取得に失敗しました: ${response.status} ${response.statusText}`
// 		);
// 	}

// 	return response.json();
// };

/**
 * 選手成績を一括更新するAPI関数
 *
 * @param tournamentId - 大会ID
 * @param data - 野手と投手の成績データ
 * @returns {Promise<any>} 更新結果
 */
export const bulkUpdatePlayerStats = async (
	tournamentId: number,
	data: {
		batters: Array<{
			id: number;
			position?: string;
			order?: number | null;
			atBats: number;
			hits: number;
			homeRuns: number;
			doubles: number;
			triples: number;
			rbi: number;
		}>;
		pitchers: Array<{
			id: number;
			order?: number | null;
			wins: number;
			losses: number;
			saves: number;
		}>;
	}
): Promise<{
	message: string;
	tournamentId: number; // キャメルケースに変換される
	updatedBatters: any[]; // キャメルケースに変換される
	updatedPitchers: any[]; // キャメルケースに変換される
	updatedAt: string; // キャメルケースに変換される
}> => {
	try {
		const response = await apiClient.post(
			`/tournaments/${tournamentId}/player-stats/bulk-update`,
			data
		);
		return response.data;
	} catch (error: any) {
		throw new Error(
			`選手成績の一括更新に失敗しました: ${
				error.response?.status || 'Unknown'
			} ${error.message}`
		);
	}
};
