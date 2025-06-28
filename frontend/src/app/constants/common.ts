// 投手ポジション
export const PITCHER_POSITIONS = [
	{ value: 'SP', label: '先発（SP）' },
	{ value: 'RP', label: '中継ぎ（RP）' },
	{ value: 'CL', label: '抑え（CL）' },
];

// 野手ポジション
export const BATTER_POSITIONS = [
	{ value: 'C', label: 'キャッチャー（C）' },
	{ value: '1B', label: 'ファースト（1B）' },
	{ value: '2B', label: 'セカンド（2B）' },
	{ value: '3B', label: 'サード（3B）' },
	{ value: 'SS', label: 'ショート（SS）' },
	{ value: 'LF', label: 'レフト（LF）' },
	{ value: 'CF', label: 'センター（CF）' },
	{ value: 'RF', label: 'ライト（RF）' },
	{ value: 'DH', label: '指名打者（DH）' },
	{ value: 'UT', label: 'ユーティリティ（UT）' },
];

// 弾道定義
export const TRAJECTORIES = [
	{ value: '1', label: 'グラウンダー' },
	{ value: '2', label: '低弾道' },
	{ value: '3', label: '中弾道' },
	{ value: '4', label: '高弾道' },
	{ value: '5', label: 'パワーヒッター' },
	{ value: '6', label: 'アーチスト' },
	{ value: '7', label: 'ラインドライブ' },
];
