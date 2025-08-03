/**
 * 野手データの型定義
 */
export interface Batter {
	id: number;
	name: string;
	position: string;
	spirit: number;
	limit_break: number;
	average: number;
	homerun: number;
	rbi: number;
	trajectory?: string; // 弾道
	skill1: number | null;
	skill2: number | null;
	skill3: number | null;
}

/**
 * 投手データの型定義
 */
export interface Pitcher {
	id: number;
	name: string;
	type: string;
	spirit: number;
	limit_break: number;
	era: number;
	strikeouts: number;
	games: number;
	skill1: number | null;
	skill2: number | null;
	skill3: number | null;
}

/**
 * API取得用の選手データ型（バックエンドのレスポンス形式）
 */
export interface PlayerApiResponse {
	id: number;
	name: string;
	position: string;
	series: string;
	spirit: number;
	limit_break: number;
	type: 'batter' | 'pitcher' | null; // 投手か野手か
	// 共通フィールド
	skill1: number | null; // 超特能
	skill2: number | null; // 特能1
	skill3: number | null; // 特能2
	// 野手専用フィールド
	average?: number;
	trajectory?: string; // 弾道
	meet?: number;
	power?: number;
	speed?: number;
	// 投手専用フィールド
	era?: number;
	velocity?: number;
	control?: number;
	stamina?: number;
}

/**
 * 選手一覧のAPIレスポンス型
 */
export interface PlayersApiResponse {
	batters: PlayerApiResponse[];
	pitchers: PlayerApiResponse[];
}
