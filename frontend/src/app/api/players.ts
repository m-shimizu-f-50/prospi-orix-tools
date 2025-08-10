import { PlayerApiResponse } from '@/app/types/player';

/**
 * APIのベースURL
 */
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 選手一覧を取得するAPI関数
 *
 * @returns {Promise<PlayerApiResponse[]>} 選手データの配列
 * @throws {Error} API呼び出しが失敗した場合
 */
export const fetchPlayers = async (): Promise<PlayerApiResponse[]> => {
	const response = await fetch(`${API_BASE_URL}/players`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(
			`選手データの取得に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();
	return data;
};

/**
 * 選手を新規登録するAPI関数
 *
 * @param playerData - 登録する選手データ
 * @returns {Promise<PlayerApiResponse>} 登録された選手データ
 * @throws {Error} API呼び出しが失敗した場合
 */
export const createPlayer = async (
	playerData: Omit<PlayerApiResponse, 'id'>
): Promise<PlayerApiResponse> => {
	const response = await fetch(`${API_BASE_URL}/players/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(playerData),
	});

	if (!response.ok) {
		throw new Error(
			`選手の登録に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();
	return data;
};

/**
 * 選手データを更新するAPI関数
 *
 * @param id - 更新する選手のID
 * @param playerData - 更新する選手データ
 * @returns {Promise<PlayerApiResponse>} 更新された選手データ
 * @throws {Error} API呼び出しが失敗した場合
 */
export const updatePlayer = async (
	id: number,
	playerData: Partial<PlayerApiResponse>
): Promise<PlayerApiResponse> => {
	const response = await fetch(`${API_BASE_URL}/players/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(playerData),
	});

	if (!response.ok) {
		throw new Error(
			`選手データの更新に失敗しました: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();
	return data;
};

/**
 * 選手を削除するAPI関数
 *
 * @param id - 削除する選手のID
 * @returns {Promise<void>}
 * @throws {Error} API呼び出しが失敗した場合
 */
export const deletePlayer = async (id: number): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/players/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(
			`選手の削除に失敗しました: ${response.status} ${response.statusText}`
		);
	}
};
