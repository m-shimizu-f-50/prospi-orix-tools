/**
 * 大会情報の型定義
 */
export interface Tournament {
	id: number;
	name: string;
	startDate: string;
	endDate?: string;
	type: 'rank_battle' | 'cup' | 'league';
	description?: string;
}

/**
 * 選手成績の型定義
 */
export interface PlayerStats {
	id: number;
	playerId: number;
	tournamentId: number;
	order: number; // オーダー
	// 投手成績
	wins: number; // 勝利数
	losses: number; // 敗北数
	draws: number; // 引き分け数
	saves: number; // セーブ数
	// 野手成績
	atBats?: number; // 打席数
	hits?: number; // 安打数
	homeRuns?: number; // 本塁打数
	doubles?: number; // 二塁打数
	triples?: number; // 三塁打数
	rbi?: number; // 打点
}

/**
 * 大会用の野手データ型（UIで使用）
 */
export interface TournamentBatter {
	id: number;
	name: string;
	position: string;
	order?: number | null; // 打順（null可能）
	// 成績データ
	atBats: number;
	hits: number;
	homeRuns: number;
	doubles: number; // 2塁打
	triples: number; // 3塁打
	rbi: number; // 打点
}

/**
 * 大会用の投手データ型（UIで使用）
 */
export interface TournamentPitcher {
	id: number;
	name: string;
	order?: number | null; // 打順（投手も打席に立つ場合）
	// 成績データ
	wins: number;
	losses: number;
	saves: number;
}

/**
 * 大会用の複合データ型
 */
export interface TournamentData {
	tournament: Tournament;
	playersWithStats: Array<{
		player: {
			id: number;
			name: string;
			position: string;
			spirit: number;
			type: 'batter' | 'pitcher';
		};
		stats: PlayerStats;
	}>;
}
