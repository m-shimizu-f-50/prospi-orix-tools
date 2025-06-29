'use client';

import {
	BATTER_POSITIONS,
	PITCHER_POSITIONS,
	TRAJECTORIES,
} from '@/app/constants/common';
import { useState } from 'react';

export default function PlayerForm() {
	type PlayerFormType = {
		name: string;
		position: string;
		spirit: string;
		limit_break: string;
		type: 'batter' | 'pitcher' | null;
		trajectory: string;
		meet: string;
		power: string;
		speed: string;
		velocity: string;
		control: string;
		stamina: string;
	};

	const initialForm: PlayerFormType = {
		name: '',
		position: '',
		spirit: '',
		limit_break: '',
		type: null,
		trajectory: '',
		meet: '',
		power: '',
		speed: '',
		velocity: '',
		control: '',
		stamina: '',
	};

	// フォームの状態を管理
	const [form, setForm] = useState<PlayerFormType>(initialForm);

	// ポジションの選択肢を動的に生成
	const positionOptions =
		form.type === 'pitcher'
			? PITCHER_POSITIONS
			: form.type === 'batter'
			? BATTER_POSITIONS
			: [];

	// フォームの入力値を更新するハンドラー
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('送信内容:', form);
		await fetch('http://localhost:8000/api/players', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		});
	};

	// 入力値の変更を処理するハンドラー
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		if (name === 'type') {
			resetFormByType(value as 'batter' | 'pitcher'); // ← 種別変更時にフォーム項目をクリア
		} else {
			setForm((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	// 選手タイプの変更時にポジションをリセット
	const resetFormByType = (type: 'batter' | 'pitcher') => {
		setForm((prev) => ({
			...prev,
			type: type,
			position: '', // ポジションをリセット
			trajectory: '', // 弾道をリセット
			meet: '', // ミートをリセット
			power: '', // パワーをリセット
			speed: '', // 走力をリセット
			velocity: '', // 球威をリセット
			control: '', // 制球をリセット
			stamina: '', // スタミナをリセット
		}));
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='max-w-3xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow'
		>
			<h2 className='text-xl font-bold'>選手登録フォーム</h2>
			{/* 選手名・ポジションなど共通項目 */}
			<div>
				<label className='block font-medium'>選手名</label>
				<input
					type='text'
					name='name'
					value={form.name}
					onChange={handleChange}
					className='w-full border p-2 rounded'
					required
				/>
			</div>
			{/* スピリッツ */}
			<div>
				<label className='block font-medium'>スピリッツ</label>
				<input
					type='number'
					name='spirit'
					value={form.spirit}
					onChange={handleChange}
					className='w-full border p-2 rounded'
					required
				/>
			</div>
			{/* 凸状況 */}
			<div>
				<label className='block font-medium'>限界突破（凸）</label>
				<input
					type='number'
					name='limit_break'
					value={form.limit_break}
					onChange={handleChange}
					min={0}
					max={5}
					className='w-full border p-2 rounded'
					required
				/>
			</div>

			{/* 種別選択（初期値はなし） */}
			<div>
				<label className='block font-medium'>種別</label>
				<div className='flex gap-4 mt-1'>
					<label>
						<input
							type='radio'
							name='type'
							value='batter'
							checked={form.type === 'batter'}
							onChange={handleChange}
						/>{' '}
						野手
					</label>
					<label>
						<input
							type='radio'
							name='type'
							value='pitcher'
							checked={form.type === 'pitcher'}
							onChange={handleChange}
						/>{' '}
						投手
					</label>
				</div>
			</div>
			{/* ポジション */}
			<div>
				<label className='block font-medium'>ポジション</label>
				<select
					name='position'
					value={form.position}
					onChange={handleChange}
					className='w-full border p-2 rounded'
					required
					disabled={!form.type} // 種別が選択されていない場合は無効化
				>
					<option value=''>選択してください</option>
					{positionOptions.map((pos) => (
						<option key={pos.value} value={pos.value}>
							{pos.label}
						</option>
					))}
				</select>
			</div>
			{/* 条件分岐：野手フォーム */}
			{form.type === 'batter' && (
				<>
					<div>
						<label className='block font-medium'>弾道</label>
						<select
							name='trajectory'
							value={form.trajectory}
							onChange={handleChange}
							className='w-full border p-2 rounded'
						>
							<option value=''>選択してください</option>
							{TRAJECTORIES.map((trajectory) => (
								<option key={trajectory.value} value={trajectory.value}>
									{trajectory.label}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className='block font-medium'>ミート</label>
						<input
							type='number'
							name='meet'
							value={form.meet}
							onChange={handleChange}
							className='w-full border p-2 rounded'
						/>
					</div>
					<div>
						<label className='block font-medium'>パワー</label>
						<input
							type='number'
							name='power'
							value={form.power}
							onChange={handleChange}
							className='w-full border p-2 rounded'
						/>
					</div>
					<div>
						<label className='block font-medium'>走力</label>
						<input
							type='number'
							name='speed'
							value={form.speed}
							onChange={handleChange}
							className='w-full border p-2 rounded'
						/>
					</div>
				</>
			)}

			{/* 条件分岐：投手フォーム */}
			{form.type === 'pitcher' && (
				<>
					<div>
						<label className='block font-medium'>球威</label>
						<input
							type='number'
							name='velocity'
							value={form.velocity}
							onChange={handleChange}
							className='w-full border p-2 rounded'
						/>
					</div>
					<div>
						<label className='block font-medium'>制球</label>
						<input
							type='number'
							name='control'
							value={form.control}
							onChange={handleChange}
							className='w-full border p-2 rounded'
						/>
					</div>
					<div>
						<label className='block font-medium'>スタミナ</label>
						<input
							type='number'
							name='stamina'
							value={form.stamina}
							onChange={handleChange}
							className='w-full border p-2 rounded'
						/>
					</div>
				</>
			)}
			<button
				type='submit'
				className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
			>
				登録する
			</button>
		</form>
	);
}
