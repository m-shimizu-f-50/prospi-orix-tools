'use client'; // useStateを使用するために必要
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Batter, Pitcher } from '@/app/types/player';
import {
	BATTER_POSITIONS,
	BATTER_SKILLS,
	BATTER_SUPER_SKILLS,
	PITCHER_POSITIONS,
	PITCHER_SKILLS,
	PITCHER_SUPER_SKILLS,
} from '@/app/constants/common';

/**
 * PlayerTableコンポーネントのProps型定義
 */
interface PlayerTableProps {
	batters: Batter[]; // 野手データ
	pitchers: Pitcher[]; // 投手データ
	loading?: boolean; // ローディング状態
	error?: string | null; // エラーメッセージ
	onRefresh?: () => void; // データ再取得関数
}

/**
 * 選手一覧テーブルコンポーネント
 *
 * 機能:
 * - 野手と投手の切り替えタブ表示
 * - 選手データをテーブル形式で表示
 * - 選手登録ページへの遷移
 * - 編集・削除ボタン（実装予定）
 *
 * @param props - PlayerTableProps
 */
export default function PlayerTable({
	batters,
	pitchers,
	loading = false,
	error = null,
	onRefresh,
}: PlayerTableProps) {
	// タブの状態を管理
	const [activeTab, setActiveTab] = useState<'batter' | 'pitcher'>('batter');

	// useRouterを使用してルーティングを行う
	const router = useRouter();

	/**
	 * 選手登録ページに遷移する関数
	 */
	const handleRegister = () => {
		router.push('/players/register');
	};

	// 野手テーブル
	const renderBatterTable = () => (
		<table className='w-full border text-sm'>
			<thead className='bg-gray-100'>
				<tr>
					<th className='p-2'>#</th>
					<th className='p-2'>選手名</th>
					<th className='p-2'>守備位置</th>
					<th className='p-2'>スピリッツ</th>
					<th className='p-2'>凸状況</th>
					<th className='p-2'>超特能</th>
					<th className='p-2'>特能</th>
					<th className='p-2'>特能</th>
					<th className='p-2'>操作</th>
				</tr>
			</thead>
			<tbody>
				{batters.map((player) => (
					<tr key={player.id} className='border-b hover:bg-gray-50 text-center'>
						<td className='p-2'>{player.id}</td>
						<td className='p-2'>{player.name}</td>
						<td className='p-2'>
							{BATTER_POSITIONS.find((p) => p.value === player.position)
								?.label || '--'}
						</td>
						<td className='p-2'>{player.spirit}</td>
						<td className='p-2'>
							{player.limitBreak === 5 ? '極' : `${player.limitBreak} / 5`}
						</td>
						<td className='p-2'>
							{BATTER_SUPER_SKILLS.find((s) => s.value === player.skill1)
								?.label || '--'}
						</td>
						<td className='p-2'>
							{BATTER_SKILLS.find((s) => s.value === player.skill2)?.label ||
								'--'}
						</td>
						<td className='p-2'>
							{BATTER_SKILLS.find((s) => s.value === player.skill3)?.label ||
								'--'}
						</td>
						<td className='p-2 space-x-2'>
							<button className='text-blue-500 hover:underline'>編集</button>
							<button className='text-red-500 hover:underline'>削除</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);

	const renderPitcherTable = () => (
		<table className='w-full border text-sm'>
			<thead className='bg-gray-100'>
				<tr>
					<th className='p-2'>#</th>
					<th className='p-2'>選手名</th>
					<th className='p-2'>投手タイプ</th>
					<th className='p-2'>スピリッツ</th>
					<th className='p-2'>凸状況</th>
					<th className='p-2'>超特能</th>
					<th className='p-2'>特能</th>
					<th className='p-2'>特能</th>
					<th className='p-2'>操作</th>
				</tr>
			</thead>
			<tbody>
				{pitchers.map((player) => (
					<tr key={player.id} className='border-b hover:bg-gray-50 text-center'>
						<td className='p-2'>{player.id}</td>
						<td className='p-2'>{player.name}</td>
						<td className='p-2'>
							{PITCHER_POSITIONS.find((p) => p.value === player.type)?.label ||
								'--'}
						</td>
						<td className='p-2'>{player.spirit}</td>
						<td className='p-2'>
							{player.limitBreak === 5 ? '極' : `${player.limitBreak} / 5`}
						</td>
						<td className='p-2'>
							{PITCHER_SUPER_SKILLS.find((s) => s.value === player.skill1)
								?.label || '--'}
						</td>
						<td className='p-2'>
							{PITCHER_SKILLS.find((s) => s.value === player.skill2)?.label ||
								'--'}
						</td>
						<td className='p-2'>
							{PITCHER_SKILLS.find((s) => s.value === player.skill3)?.label ||
								'--'}
						</td>
						<td className='p-2 space-x-2'>
							<button className='text-blue-500 hover:underline'>編集</button>
							<button className='text-red-500 hover:underline'>削除</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);

	// ローディング状態の表示
	if (loading) {
		return (
			<div className='max-w-6xl mx-auto p-4'>
				<div className='flex justify-center items-center h-64'>
					<div className='text-lg text-gray-600'>データを読み込み中...</div>
				</div>
			</div>
		);
	}

	// エラー状態の表示
	if (error) {
		return (
			<div className='max-w-6xl mx-auto p-4'>
				<div className='flex flex-col justify-center items-center h-64 space-y-4'>
					<div className='text-lg text-red-600'>エラーが発生しました</div>
					<div className='text-sm text-gray-600'>{error}</div>
					{onRefresh && (
						<button
							onClick={onRefresh}
							className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
						>
							再読み込み
						</button>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className='max-w-6xl mx-auto p-4'>
			<div className='flex border-b mb-4 justify-between'>
				<div>
					<button
						className={`px-4 py-2 font-semibold ${
							activeTab === 'batter'
								? 'border-b-2 border-blue-500'
								: 'text-gray-500'
						}`}
						onClick={() => setActiveTab('batter')}
					>
						野手 ( {batters.length} )
					</button>
					<button
						className={`px-4 py-2 font-semibold ${
							activeTab === 'pitcher'
								? 'border-b-2 border-blue-500'
								: 'text-gray-500'
						}`}
						onClick={() => setActiveTab('pitcher')}
					>
						投手 ( {pitchers.length} )
					</button>
				</div>
				<div className='flex space-x-2'>
					{onRefresh && (
						<button
							onClick={onRefresh}
							className='px-4 py-1.5 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600'
						>
							更新
						</button>
					)}
					<button
						className='px-4 py-1.5 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600'
						onClick={handleRegister}
					>
						選手登録
					</button>
				</div>
			</div>

			{activeTab === 'batter' ? renderBatterTable() : renderPitcherTable()}
		</div>
	);
}
