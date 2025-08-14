'use client';

import {
	BATTER_POSITIONS,
	PITCHER_POSITIONS,
	TRAJECTORIES,
	PITCHER_SUPER_SKILLS,
	PITCHER_SKILLS,
	BATTER_SUPER_SKILLS,
	BATTER_SKILLS,
} from '@/app/constants/common';
import { useState } from 'react';
import { useToast } from '@/app/contexts/ToastContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPlayer } from '@/app/api/players';
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
import { useRouter } from 'next/navigation';

export default function PlayerForm() {
	const { showToast } = useToast();
	const queryClient = useQueryClient();
	// useRouterを使用してルーティングを行う
	const router = useRouter();

	// TanStack QueryのuseMutationを使用して選手登録処理を管理
	const createPlayerMutation = useMutation({
		mutationFn: createPlayer,
		onSuccess: () => {
			// 登録成功時の処理
			showToast('選手の登録が完了しました！', 'success');
			setForm(initialForm); // フォームをリセット
			// 選手一覧のキャッシュを無効化して最新データを取得
			queryClient.invalidateQueries({ queryKey: ['players'] });
			// 選手一覧ページに遷移
			router.push('/players');
		},
		onError: (error) => {
			// 登録失敗時の処理
			showToast(
				error instanceof Error
					? error.message
					: '登録に失敗しました。もう一度お試しください。',
				'error'
			);
		},
	});

	type PlayerFormType = {
		name: string;
		position: string;
		series: string;
		spirit: number;
		limit_break: number;
		type: 'batter' | 'pitcher' | null;
		trajectory: string; // 弾道（野手のみ）
		meet: number;
		power: number;
		speed: number;
		velocity: number;
		control: number;
		stamina: number;
		skill1: number | null;
		skill2: number | null;
		skill3: number | null;
	};

	const initialForm: PlayerFormType = {
		name: '',
		position: '',
		series: '',
		spirit: 4500,
		limit_break: 5,
		type: null,
		trajectory: '',
		meet: 70,
		power: 70,
		speed: 70,
		velocity: 70,
		control: 70,
		stamina: 70,
		skill1: null,
		skill2: null,
		skill3: null,
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

		// TanStack QueryのmutationでAPI呼び出し
		createPlayerMutation.mutate(form);
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
			// スキルフィールドの場合、空文字列をnullに変換
			const convertedValue =
				name.startsWith('skill') && value === '' ? null : value;

			setForm((prev) => ({
				...prev,
				[name]: convertedValue,
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
			meet: 70, // ミートをリセット
			power: 70, // パワーをリセット
			speed: 70, // 走力をリセット
			velocity: 70, // 球威をリセット
			control: 70, // 制球をリセット
			stamina: 70, // スタミナをリセット
			skill1: null, // スキルをリセット
			skill2: null, // スキルをリセット
			skill3: null, // スキルをリセット
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

						{/* 超特能 */}
						<FormControl fullWidth>
							<FormLabel>超特能</FormLabel>
							<Select
								name='skill1'
								value={form.skill1 ?? ''}
								onChange={handleSelectChange}
							>
								<MenuItem value=''>選択してください</MenuItem>
								{BATTER_SUPER_SKILLS.map((skill) => (
									<MenuItem key={skill.value} value={skill.value}>
										{skill.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						{/* 特能1 */}
						<FormControl fullWidth>
							<FormLabel>特能1</FormLabel>
							<Select
								name='skill2'
								value={form.skill2 ?? ''}
								onChange={handleSelectChange}
							>
								<MenuItem value=''>選択してください</MenuItem>
								{BATTER_SKILLS.map((skill) => (
									<MenuItem key={skill.value} value={skill.value}>
										{skill.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						{/* 特能2 */}
						<FormControl fullWidth>
							<FormLabel>特能2</FormLabel>
							<Select
								name='skill3'
								value={form.skill3 ?? ''}
								onChange={handleSelectChange}
							>
								<MenuItem value=''>選択してください</MenuItem>
								{BATTER_SKILLS.map((skill) => (
									<MenuItem key={skill.value} value={skill.value}>
										{skill.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
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
						{/* 超特能 */}
						<FormControl fullWidth>
							<FormLabel>超特能</FormLabel>
							<Select
								name='skill1'
								value={form.skill1 ?? ''}
								onChange={handleSelectChange}
							>
								<MenuItem value=''>選択してください</MenuItem>
								{PITCHER_SUPER_SKILLS.map((skill) => (
									<MenuItem key={skill.value} value={skill.value}>
										{skill.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						{/* 特能1 */}
						<FormControl fullWidth>
							<FormLabel>特能1</FormLabel>
							<Select
								name='skill2'
								value={form.skill2 ?? ''}
								onChange={handleSelectChange}
							>
								<MenuItem value=''>選択してください</MenuItem>
								{PITCHER_SKILLS.map((skill) => (
									<MenuItem key={skill.value} value={skill.value}>
										{skill.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						{/* 特能2 */}
						<FormControl fullWidth>
							<FormLabel>特能2</FormLabel>
							<Select
								name='skill3'
								value={form.skill3 ?? ''}
								onChange={handleSelectChange}
							>
								<MenuItem value=''>選択してください</MenuItem>
								{PITCHER_SKILLS.map((skill) => (
									<MenuItem key={skill.value} value={skill.value}>
										{skill.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				)}

				<Button
					type='submit'
					variant='contained'
					color='primary'
					size='large'
					sx={{ mt: 2 }}
					disabled={createPlayerMutation.isPending}
				>
					{createPlayerMutation.isPending ? '登録中...' : '登録する'}
				</Button>
			</Stack>
		</Paper>
	);
}
