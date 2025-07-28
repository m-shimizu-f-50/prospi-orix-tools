'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

/**
 * QueryProviderのProps型定義
 */
interface QueryProviderProps {
	children: ReactNode;
}

/**
 * TanStack Query用のプロバイダーコンポーネント
 *
 * 機能:
 * - QueryClientの設定と提供
 * - 開発者ツールの有効化
 * - キャッシュ戦略の設定
 *
 * 設定内容:
 * - defaultOptions: デフォルトのクエリオプション
 * - staleTime: データが古くなるまでの時間（5分）
 * - gcTime: ガベージコレクションの時間（10分）
 * - retry: 失敗時のリトライ回数（1回）
 */
export default function QueryProvider({ children }: QueryProviderProps) {
	// QueryClientを初期化（コンポーネント再レンダリング時に再作成されないようにuseStateを使用）
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// データが5分間は新鮮とみなされる
						staleTime: 5 * 60 * 1000,
						// 10分後にキャッシュからデータを削除
						gcTime: 10 * 60 * 1000,
						// エラー時のリトライ回数
						retry: 1,
						// ウィンドウフォーカス時の自動再取得を無効化
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* 開発環境でのみReact Query DevToolsを表示 */}
			{process.env.NODE_ENV === 'development' && (
				<ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
			)}
		</QueryClientProvider>
	);
}
