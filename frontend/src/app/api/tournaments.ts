import {
	Tournament,
	PlayerStats,
	TournamentData,
} from '@/app/types/tournament';

/**
 * APIのベースURL
 */
const API_BASE_URL = 'http://localhost:8000/api';

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
	const response = await fetch(
		`${API_BASE_URL}/tournaments/${tournamentId}/details`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	if (!response.ok) {
		throw new Error(
			`大会データの取得に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
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
	const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(
			`大会情報の取得に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * 大会一覧を取得するAPI関数
 *
 * 用途: 大会選択画面、大会一覧表示
 *
 * @param type - 大会タイプでフィルタ（オプション）
 * @returns {Promise<Tournament[]>} 大会一覧
 */
export const fetchTournaments = async (
	type?: 'rank_battle' | 'cup' | 'league'
): Promise<Tournament[]> => {
	const url = new URL(`${API_BASE_URL}/tournaments`);
	if (type) {
		url.searchParams.append('type', type);
	}

	const response = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(
			`大会一覧の取得に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * 特定の大会の選手成績のみを取得するAPI関数
 *
 * 用途: 成績の個別更新、リアルタイム更新
 *
 * @param tournamentId - 大会ID
 * @returns {Promise<PlayerStats[]>} 選手成績一覧
 */
export const fetchPlayerStats = async (
	tournamentId: number
): Promise<PlayerStats[]> => {
	const response = await fetch(
		`${API_BASE_URL}/tournaments/${tournamentId}/player-stats`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	if (!response.ok) {
		throw new Error(
			`選手成績の取得に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * 特定選手の成績のみを取得するAPI関数
 *
 * 用途: 個別選手の詳細成績表示
 *
 * @param tournamentId - 大会ID
 * @param playerId - 選手ID
 * @returns {Promise<PlayerStats>} 選手成績
 */
export const fetchPlayerStat = async (
	tournamentId: number,
	playerId: number
): Promise<PlayerStats> => {
	const response = await fetch(
		`${API_BASE_URL}/tournaments/${tournamentId}/players/${playerId}/stats`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	if (!response.ok) {
		throw new Error(
			`選手成績の取得に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * 選手成績を更新するAPI関数
 *
 * @param tournamentId - 大会ID
 * @param playerId - 選手ID
 * @param stats - 更新する成績データ
 * @returns {Promise<PlayerStats>} 更新された選手成績
 */
export const updatePlayerStats = async (
	tournamentId: number,
	playerId: number,
	stats: Partial<PlayerStats>
): Promise<PlayerStats> => {
	const response = await fetch(
		`${API_BASE_URL}/tournaments/${tournamentId}/players/${playerId}/stats`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(stats),
		}
	);

	if (!response.ok) {
		throw new Error(
			`選手成績の更新に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * 新しい大会を作成するAPI関数
 *
 * @param tournament - 作成する大会データ
 * @returns {Promise<Tournament>} 作成された大会情報
 */
export const createTournament = async (
	tournament: Omit<Tournament, 'id'>
): Promise<Tournament> => {
	const response = await fetch(`${API_BASE_URL}/tournaments`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(tournament),
	});

	if (!response.ok) {
		throw new Error(
			`大会の作成に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

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
	tournament_id: number;
	updated_batters: any[];
	updated_pitchers: any[];
	updated_at: string;
}> => {
	const response = await fetch(
		`${API_BASE_URL}/tournaments/${tournamentId}/player-stats/bulk-update`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		throw new Error(
			`選手成績の一括更新に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};
