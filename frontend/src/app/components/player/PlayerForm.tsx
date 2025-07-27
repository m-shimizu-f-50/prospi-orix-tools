'use client';

import {
	BATTER_POSITIONS,
	PITCHER_POSITIONS,
	TRAJECTORIES,
} from '@/app/constants/common';
import { useState } from 'react';
import { useToast } from '@/app/contexts/ToastContext';
import {
	TextField,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Select,
	MenuItem,
	Button,
	Typography,
	Paper,
	Stack,
} from '@mui/material';

export default function PlayerForm() {
	const { showToast } = useToast();

	type PlayerFormType = {
		name: string;
		position: string;
		series: string;
		spirit: number;
		limit_break: number;
		type: 'batter' | 'pitcher' | null;
		average: number | null;
		trajectory: string;
		meet: number;
		power: number;
		speed: number;
		era: number | null;
		velocity: number;
		control: number;
		stamina: number;
	};

	const initialForm: PlayerFormType = {
		name: '',
		position: '',
		series: '',
		spirit: 4000,
		limit_break: 0,
		type: null,
		average: null,
		trajectory: '',
		meet: 50,
		power: 50,
		speed: 50,
		era: null,
		velocity: 50,
		control: 50,
		stamina: 50,
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

		try {
			const response = await fetch('http://localhost:8000/api/players', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			if (response.ok) {
				showToast('選手の登録が完了しました！', 'success');
				setForm(initialForm); // フォームをリセット
			} else {
				showToast('登録に失敗しました。もう一度お試しください。', 'error');
			}
		} catch {
			showToast('エラーが発生しました。もう一度お試しください。', 'error');
		}
	};

	// 入力値の変更を処理するハンドラー（TextField用）
	const handleTextFieldChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		if (name === 'type') {
			resetFormByType(value as 'batter' | 'pitcher');
		} else {
			setForm((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	// Select用のハンドラー
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSelectChange = (e: any) => {
		const { name, value } = e.target;

		if (name === 'type') {
			resetFormByType(value as 'batter' | 'pitcher');
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
			meet: 50, // ミートをリセット
			power: 50, // パワーをリセット
			speed: 50, // 走力をリセット
			velocity: 50, // 球威をリセット
			control: 50, // 制球をリセット
			stamina: 50, // スタミナをリセット
		}));
	};

	return (
		<Paper
			component='form'
			onSubmit={handleSubmit}
			sx={{
				maxWidth: 'lg',
				mx: 'auto',
				p: 3,
				bgcolor: 'background.paper',
			}}
		>
			<Stack spacing={3}>
				<Typography variant='h5' component='h2' fontWeight='bold'>
					選手登録フォーム
				</Typography>

				{/* 選手名 */}
				<TextField
					label='選手名'
					name='name'
					value={form.name}
					onChange={handleTextFieldChange}
					fullWidth
					required
					inputProps={{
						maxLength: 50,
					}}
				/>

				{/* スピリッツ */}
				<TextField
					label='スピリッツ'
					name='spirit'
					type='number'
					value={form.spirit}
					onChange={handleTextFieldChange}
					fullWidth
					required
					inputProps={{
						min: 2800,
						step: 100,
					}}
					helperText='スピリッツは2800以上で100単位で入力してください'
				/>

				{/* シリーズ */}
				<TextField
					label='シリーズ'
					name='series'
					value={form.series}
					onChange={handleTextFieldChange}
					fullWidth
					required
				/>

				{/* 限界突破（凸） */}
				<TextField
					label='限界突破（凸）'
					name='limit_break'
					type='number'
					value={form.limit_break}
					onChange={handleTextFieldChange}
					fullWidth
					required
					inputProps={{
						min: 0,
						max: 5,
					}}
				/>

				{/* 種別選択 */}
				<FormControl>
					<FormLabel>種別</FormLabel>
					<RadioGroup
						name='type'
						value={form.type || ''}
						onChange={handleSelectChange}
						row
					>
						<FormControlLabel value='batter' control={<Radio />} label='野手' />
						<FormControlLabel
							value='pitcher'
							control={<Radio />}
							label='投手'
						/>
					</RadioGroup>
				</FormControl>

				{/* ポジション */}
				<FormControl fullWidth disabled={!form.type}>
					<FormLabel>ポジション</FormLabel>
					<Select
						name='position'
						value={form.position}
						onChange={handleSelectChange}
						required
					>
						<MenuItem value=''>選択してください</MenuItem>
						{positionOptions.map((pos) => (
							<MenuItem key={pos.value} value={pos.value}>
								{pos.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* 条件分岐：野手フォーム */}
				{form.type === 'batter' && (
					<Stack spacing={3}>
						{/* 弾道 */}
						<FormControl fullWidth>
							<FormLabel>弾道</FormLabel>
							<Select
								name='trajectory'
								value={form.trajectory}
								onChange={handleSelectChange}
							>
								<MenuItem value=''>選択してください</MenuItem>
								{TRAJECTORIES.map((trajectory) => (
									<MenuItem key={trajectory.value} value={trajectory.value}>
										{trajectory.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{/* ミート */}
						<TextField
							label='ミート'
							name='meet'
							type='number'
							value={form.meet}
							onChange={handleTextFieldChange}
							fullWidth
							inputProps={{
								min: 0,
								max: 99,
							}}
						/>

						{/* パワー */}
						<TextField
							label='パワー'
							name='power'
							type='number'
							value={form.power}
							onChange={handleTextFieldChange}
							fullWidth
							inputProps={{
								min: 0,
								max: 99,
							}}
						/>

						{/* 走力 */}
						<TextField
							label='走力'
							name='speed'
							type='number'
							value={form.speed}
							onChange={handleTextFieldChange}
							fullWidth
							inputProps={{
								min: 0,
								max: 99,
							}}
						/>
					</Stack>
				)}

				{/* 条件分岐：投手フォーム */}
				{form.type === 'pitcher' && (
					<Stack spacing={3}>
						{/* 球威 */}
						<TextField
							label='球威'
							name='velocity'
							type='number'
							value={form.velocity}
							onChange={handleTextFieldChange}
							fullWidth
							inputProps={{
								min: 0,
								max: 99,
							}}
						/>

						{/* 制球 */}
						<TextField
							label='制球'
							name='control'
							type='number'
							value={form.control}
							onChange={handleTextFieldChange}
							fullWidth
							inputProps={{
								min: 0,
								max: 99,
							}}
						/>

						{/* スタミナ */}
						<TextField
							label='スタミナ'
							name='stamina'
							type='number'
							value={form.stamina}
							onChange={handleTextFieldChange}
							fullWidth
							inputProps={{
								min: 0,
								max: 99,
							}}
						/>
					</Stack>
				)}

				<Button
					type='submit'
					variant='contained'
					color='primary'
					size='large'
					sx={{ mt: 2 }}
				>
					登録する
				</Button>
			</Stack>
		</Paper>
	);
}
