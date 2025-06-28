'use client'; // useStateを使用するために必要
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PlayerTable() {
	// タブの状態を管理
	const [activeTab, setActiveTab] = useState<'batter' | 'pitcher'>('batter');

	// useRouterを使用してルーティングを行う
	const router = useRouter();

	const handleRegister = () => {
		// 選手登録ページに遷移
		router.push('/players/register');
	};

	const batters = [
		{
			id: 1,
			name: '吉田 正尚',
			position: 'LF',
			spirit: 4200,
			limit_break: 3,
			average: 0.312,
			homerun: 15,
			rbi: 55,
		},
		{
			id: 2,
			name: '森 友哉',
			position: 'C',
			spirit: 4100,
			limit_break: 2,
			average: 0.287,
			homerun: 9,
			rbi: 40,
		},
	];

	const pitchers = [
		{
			id: 1,
			name: '山本 由伸',
			type: 'SP',
			spirit: 4300,
			limit_break: 5,
			era: 1.95,
			strikeouts: 120,
			games: 18,
		},
		{
			id: 2,
			name: '宮城 大弥',
			type: 'SP',
			spirit: 4200,
			limit_break: 3,
			era: 2.68,
			strikeouts: 95,
			games: 15,
		},
	];

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
					<th className='p-2'>打率</th>
					<th className='p-2'>本塁打</th>
					<th className='p-2'>打点</th>
					<th className='p-2'>操作</th>
				</tr>
			</thead>
			<tbody>
				{batters.map((player) => (
					<tr key={player.id} className='border-b hover:bg-gray-50 text-center'>
						<td className='p-2'>{player.id}</td>
						<td className='p-2'>{player.name}</td>
						<td className='p-2'>{player.position}</td>
						<td className='p-2'>{player.spirit}</td>
						<td className='p-2'>{player.limit_break}/5</td>
						<td className='p-2'>{player.average.toFixed(3)}</td>
						<td className='p-2'>{player.homerun}</td>
						<td className='p-2'>{player.rbi}</td>
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
					<th className='p-2'>防御率</th>
					<th className='p-2'>奪三振</th>
					<th className='p-2'>登板数</th>
					<th className='p-2'>操作</th>
				</tr>
			</thead>
			<tbody>
				{pitchers.map((player) => (
					<tr key={player.id} className='border-b hover:bg-gray-50 text-center'>
						<td className='p-2'>{player.id}</td>
						<td className='p-2'>{player.name}</td>
						<td className='p-2'>{player.type}</td>
						<td className='p-2'>{player.spirit}</td>
						<td className='p-2'>{player.limit_break}/5</td>
						<td className='p-2'>{player.era.toFixed(2)}</td>
						<td className='p-2'>{player.strikeouts}</td>
						<td className='p-2'>{player.games}</td>
						<td className='p-2 space-x-2'>
							<button className='text-blue-500 hover:underline'>編集</button>
							<button className='text-red-500 hover:underline'>削除</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);

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
						野手
					</button>
					<button
						className={`px-4 py-2 font-semibold ${
							activeTab === 'pitcher'
								? 'border-b-2 border-blue-500'
								: 'text-gray-500'
						}`}
						onClick={() => setActiveTab('pitcher')}
					>
						投手
					</button>
				</div>
				<div>
					<button
						className='mb-1  px-4 py-1.5 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600'
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
