import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

/**
 * Laravel APIとの通信用のAxiosインスタンス
 *
 * 機能:
 * - スネークケース ⇔ キャメルケース の自動変換
 * - リクエスト時: キャメルケース → スネークケース
 * - レスポンス時: スネークケース → キャメルケース
 */
const apiClient = applyCaseMiddleware(
	axios.create({
		baseURL: 'http://localhost:8000/api',
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	// デフォルト設定を使用（キャメルケース ⇔ スネークケース変換）
);

export default apiClient;
