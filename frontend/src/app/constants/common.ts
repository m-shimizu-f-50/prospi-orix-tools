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

// スキル定義
export const PITCHER_SUPER_SKILLS = [
	{ value: '1', label: '超ノビ' },
	{ value: '2', label: '超キレ' },
	{ value: '3', label: '超援護' },
	{ value: '4', label: '超奪三振' },
	{ value: '5', label: '超コントロール' },
	{ value: '6', label: '超対ピンチ' },
	{ value: '7', label: '超豪速球' },
	{ value: '8', label: '超重い球' },
	{ value: '9', label: '超存在感' },
	{ value: '10', label: '超打たれ強さ' },
	{ value: '10', label: '超対左打者' },
	{ value: '11', label: '超対右打者' },
	{ value: '12', label: '超奪三振ショー' },
	{ value: '13', label: '超緩急' },
	{ value: '14', label: '超グランドボーラー' },
	{ value: '15', label: '超奥行き' },
];

export const PITCHER_SKILLS = [
	'広角打法',
	'アーチスト',
	'対ピンチ',
	'選球眼',
	'固め打ち',
	// など...
];
