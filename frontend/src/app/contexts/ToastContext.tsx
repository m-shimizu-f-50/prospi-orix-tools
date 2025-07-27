'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

/**
 * トースト通知のコンテキスト型定義
 * showToast: トースト通知を表示する関数
 * - message: 表示するメッセージ
 * - severity: 通知の種類（success, error, warning, info）
 */
interface ToastContextType {
	showToast: (message: string, severity?: AlertColor) => void;
}

// トースト通知用のReact Contextを作成
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * トースト通知用のカスタムフック
 * このフックを使用するコンポーネントは、ToastProviderでラップされている必要があります
 * @returns {ToastContextType} showToast関数を含むオブジェクト
 * @throws {Error} ToastProviderの外で使用された場合
 */
export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};

/**
 * ToastProviderのprops型定義
 */
interface ToastProviderProps {
	children: ReactNode;
}

/**
 * トースト通知を管理するプロバイダーコンポーネント
 *
 * 機能:
 * - トースト通知の表示/非表示状態を管理
 * - メッセージと通知の種類（severity）を管理
 * - Material-UIのSnackbarとAlertコンポーネントを使用してUIを表示
 *
 * 使用方法:
 * 1. アプリのルート（layout.tsx）でToastProviderでラップ
 * 2. 各コンポーネントでuseToastフックを使用してshowToast関数を取得
 * 3. showToast('メッセージ', 'success')のように呼び出し
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
	// トースト通知の表示状態（true: 表示, false: 非表示）
	const [open, setOpen] = useState(false);
	// 表示するメッセージ
	const [message, setMessage] = useState('');
	// 通知の種類（success, error, warning, info）
	const [severity, setSeverity] = useState<AlertColor>('success');

	/**
	 * トースト通知を表示する関数
	 * @param message - 表示するメッセージ
	 * @param severity - 通知の種類（デフォルト: 'success'）
	 */
	const showToast = (message: string, severity: AlertColor = 'success') => {
		setMessage(message);
		setSeverity(severity);
		setOpen(true);
	};

	/**
	 * トースト通知を閉じる関数
	 * ユーザーが手動で閉じる場合や自動で閉じる場合に呼び出される
	 */
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{/* アプリの子コンポーネント */}
			{children}

			{/* トースト通知のUIコンポーネント */}
			<Snackbar
				open={open} // 表示状態
				autoHideDuration={6000} // 6秒後に自動で閉じる
				onClose={handleClose} // 閉じる時の処理
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // 画面右上に表示
			>
				{/* アラートコンポーネント（色分けされた通知） */}
				<Alert
					onClose={handleClose} // 閉じるボタンの処理
					severity={severity} // 通知の種類（色分け）
					sx={{ width: '100%' }} // 幅を100%に設定
				>
					{message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	);
};
