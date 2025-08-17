'use client';

import { useState, useEffect } from 'react';
import {
	Paper,
	Typography,
	Box,
	Card,
	CardContent,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Tabs,
	Tab,
} from '@mui/material';
import { useTournamentData } from '../hooks/useTournamentData';
import { TournamentBatter, TournamentPitcher } from '../types/tournament';
import { bulkUpdatePlayerStats } from '../api/tournaments';
import { BATTER_POSITIONS, PITCHER_POSITIONS } from '../constants/common';

// Material-UI Icons の代替として文字を使用
const EditIcon = () => <span>✏️</span>;
const DragIcon = () => <span>☰</span>;
const TrendingUpIcon = () => <span style={{ color: 'green' }}>📈</span>;
const TrendingDownIcon = () => <span style={{ color: 'red' }}>📉</span>;
const SaveIcon = () => <span>💾</span>;

type SimpleStats = {
	atBats: number; // 打数
	hits: number; // 単打
	doubles: number; // 二塁打
	triples: number; // 三塁打
	homeRuns: number; // 本塁打
};

// 打数計算関数
const calculateAverage = (stats: SimpleStats): number => {
	const totalHits = stats.hits + stats.doubles + stats.triples + stats.homeRuns;
	return stats.atBats > 0 ? totalHits / stats.atBats : 0;
};

// 長打率（Slugging Percentage）
const calculateSLG = (stats: SimpleStats): number => {
	const totalBases =
		stats.hits + stats.doubles * 2 + stats.triples * 3 + stats.homeRuns * 4;

	return stats.atBats > 0 ? totalBases / stats.atBats : 0;
};

// OPS（簡易版：OBP = 安打数 ÷ 打数）
// TODO: 実際のOBP計算は四球や死球などもあるとより正確に計算できる（四球（BB）、死球（HBP）、犠牲フライ（SF））
const calculateOPS = (stats: SimpleStats): number => {
	const totalHits = stats.hits + stats.doubles + stats.triples + stats.homeRuns;

	const obp = stats.atBats > 0 ? totalHits / stats.atBats : 0;
	const slg = calculateSLG(stats);

	return obp + slg;
};

// 勝率計算関数（投手用）
const calculateWinRate = (wins: number, losses: number): number => {
	const totalGames = wins + losses;
	return totalGames > 0 ? wins / totalGames : 0;
};

/**
 * ランク戦ページコンポーネント
 */
export default function Rank() {
	// ランク戦ID
	const RANK_ID = 1;
	// 大会データを取得（大会ID: ランク戦）
	const { batters, pitchers, tournament, loading, error, refetch } =
		useTournamentData(RANK_ID);

	console.log(batters, pitchers, tournament);

	// 状態管理
	const [activeTab, setActiveTab] = useState(0);
	const [teamRecordEditOpen, setTeamRecordEditOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	// 編集用データの状態管理（APIデータとモックデータの両方に対応）
	const [editableBatters, setEditableBatters] = useState<TournamentBatter[]>(
		[]
	);
	const [editablePitchers, setEditablePitchers] = useState<TournamentPitcher[]>(
		[]
	);

	// モックデータ
	const [teamRecord, setTeamRecord] = useState({
		wins: 15,
		losses: 8,
		currentRank: 'A1',
		previousRank: 'A2',
		winStreak: 3,
		recentGames: [
			{ opponent: 'チーム A', result: 'W', score: '5-3' },
			{ opponent: 'チーム B', result: 'W', score: '7-2' },
			{ opponent: 'チーム C', result: 'W', score: '4-1' },
			{ opponent: 'チーム D', result: 'L', score: '2-6' },
			{ opponent: 'チーム E', result: 'W', score: '8-4' },
		],
	});

	// 勝率計算
	const winRate = (
		(teamRecord.wins / (teamRecord.wins + teamRecord.losses)) *
		100
	).toFixed(1);

	// チーム戦績編集
	const handleTeamRecordEdit = () => {
		setTeamRecordEditOpen(true);
	};

	// 編集モード切り替え
	const toggleEditMode = () => {
		if (isEditing && hasChanges) {
			// 編集中で変更がある場合は保存確認
			if (window.confirm('変更を保存しますか？')) {
				handleSaveAll();
			} else {
				// 保存しない場合は元のデータに戻す
				setEditableBatters(batters);
				setEditablePitchers(pitchers);
			}
		}
		setIsEditing(!isEditing);
		setHasChanges(false);
	};

	// 選手成績更新（野手）
	const updateBatterStat = (
		id: number,
		field: string,
		value: string | number | null
	) => {
		setEditableBatters((prev) =>
			prev.map((player) => {
				if (player.id === id) {
					const updatedPlayer = { ...player, [field]: value };
					return updatedPlayer;
				}
				return player;
			})
		);
		setHasChanges(true);
	};

	// 選手成績更新（投手）
	const updatePitcherStat = (
		id: number,
		field: string,
		value: string | number | null
	) => {
		setEditablePitchers((prev) =>
			prev.map((player) => {
				if (player.id === id) {
					const updatedPlayer = { ...player, [field]: value };

					return updatedPlayer;
				}
				return player;
			})
		);
		setHasChanges(true);
	};

	// 全データ保存
	const handleSaveAll = async () => {
		try {
			console.log('保存データ:', {
				batters: editableBatters,
				pitchers: editablePitchers,
			});

			// APIへの一括保存処理（基本データのみ送信）
			const result = await bulkUpdatePlayerStats(RANK_ID, {
				batters: editableBatters.map((batter) => ({
					id: batter.id,
					position: batter.position,
					order: batter.order,
					atBats: batter.atBats,
					hits: batter.hits,
					homeRuns: batter.homeRuns,
					doubles: batter.doubles || 0,
					triples: batter.triples || 0,
					rbi: batter.rbi,
				})),
				pitchers: editablePitchers.map((pitcher) => ({
					id: pitcher.id,
					order: pitcher.order,
					wins: pitcher.wins,
					losses: pitcher.losses,
					saves: pitcher.saves,
				})),
			});

			console.log('保存結果:', result);

			// 成功メッセージを表示
			alert(
				`選手成績を一括保存しました！\n野手: ${result.updatedBatters.length}名\n投手: ${result.updatedPitchers.length}名`
			);
			setHasChanges(false);

			// データを再取得して最新状態に更新
			refetch();
		} catch (error) {
			console.error('保存エラー:', error);
			alert('選手成績の保存に失敗しました。再度お試しください。');
		}
	};

	// APIデータが取得できた場合、編集用stateに設定
	useEffect(() => {
		if (batters.length > 0) {
			setEditableBatters(batters);
		}
	}, [batters]);

	useEffect(() => {
		if (pitchers.length > 0) {
			setEditablePitchers(pitchers);
		}
	}, [pitchers]);

	// 表示用データは編集用stateを使用
	const displayBatters = editableBatters;
	const displayPitchers = editablePitchers;

	if (loading) return <div className='p-6'>読み込み中...</div>;

	if (error) {
		return (
			<div className='p-6'>
				<Typography color='error'>エラーが発生しました: {error}</Typography>
				<Button onClick={() => refetch()} variant='outlined' sx={{ mt: 2 }}>
					再試行
				</Button>
			</div>
		);
	}

	return (
		<main className='p-3 space-y-3'>
			{/* ページヘッダー */}
			<Box mb={2}>
				<Typography variant='h5' component='h1' sx={{ mb: 1 }}>
					ランク戦
				</Typography>
			</Box>

			{/* チーム戦績カード */}
			<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
				<Box flex={{ xs: '1', md: '2' }}>
					<Card>
						<CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
							<Box
								display='flex'
								justifyContent='space-between'
								alignItems='center'
								mb={1.5}
							>
								<Typography variant='h6' sx={{ fontSize: '1.1rem' }}>
									チーム戦績
								</Typography>
								<IconButton onClick={handleTeamRecordEdit} size='small'>
									<EditIcon />
								</IconButton>
							</Box>

							<Box
								display='grid'
								gridTemplateColumns={{
									xs: 'repeat(2, 1fr)',
									sm: 'repeat(4, 1fr)',
								}}
								gap={2}
							>
								<Box textAlign='center'>
									<Typography variant='h4' color='primary'>
										{teamRecord.wins}
									</Typography>
									<Typography variant='caption' color='text.secondary'>
										勝利
									</Typography>
								</Box>
								<Box textAlign='center'>
									<Typography variant='h4' color='error'>
										{teamRecord.losses}
									</Typography>
									<Typography variant='caption' color='text.secondary'>
										敗北
									</Typography>
								</Box>
								<Box textAlign='center'>
									<Typography variant='h4' color='success.main'>
										{winRate}%
									</Typography>
									<Typography variant='caption' color='text.secondary'>
										勝率
									</Typography>
								</Box>
								<Box textAlign='center'>
									<Box
										display='flex'
										alignItems='center'
										justifyContent='center'
										gap={0.5}
									>
										<Typography variant='h4'>
											{teamRecord.currentRank}
										</Typography>
										{teamRecord.currentRank > teamRecord.previousRank ? (
											<TrendingUpIcon />
										) : (
											<TrendingDownIcon />
										)}
									</Box>
									<Typography variant='caption' color='text.secondary'>
										現在のランク
									</Typography>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Box>
			</Box>

			{/* 選手成績テーブル */}
			<Paper>
				<Box p={2}>
					<Box
						display='flex'
						justifyContent='space-between'
						alignItems='center'
						mb={1.5}
					>
						<Typography variant='h6' sx={{ fontSize: '1.1rem' }}>
							選手成績
						</Typography>
						<Box display='flex' gap={1}>
							<Button
								variant={isEditing ? 'contained' : 'outlined'}
								color={isEditing ? 'secondary' : 'primary'}
								onClick={toggleEditMode}
								startIcon={<EditIcon />}
							>
								{isEditing ? '編集終了' : '編集モード'}
							</Button>
							{isEditing && hasChanges && (
								<Button
									variant='contained'
									color='primary'
									onClick={handleSaveAll}
									startIcon={<SaveIcon />}
								>
									一括保存
								</Button>
							)}
						</Box>
					</Box>

					<Tabs
						value={activeTab}
						onChange={(e, newValue) => setActiveTab(newValue)}
					>
						<Tab label={`野手 (${displayBatters.length})`} />
						<Tab label={`投手 (${displayPitchers.length})`} />
					</Tabs>

					{/* 野手テーブル */}
					{activeTab === 0 && (
						<>
							{displayBatters.length === 0 ? (
								<Box textAlign='center' py={4}>
									<Typography color='text.secondary'>
										野手データがありません
									</Typography>
								</Box>
							) : (
								<TableContainer sx={{ mt: 1.5 }}>
									<Table size='small'>
										<TableHead>
											<TableRow>
												<TableCell
													sx={{ py: 1, textAlign: 'center' }}
												></TableCell>
												<TableCell sx={{ py: 1, textAlign: 'center' }}>
													選手名
												</TableCell>
												<TableCell sx={{ py: 1, textAlign: 'center' }}>
													オーダー
												</TableCell>
												<TableCell sx={{ py: 1, textAlign: 'center' }}>
													守備位置
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													打数
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													安打
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													2塁打
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													3塁打
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													本塁打
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													打点
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													打率
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													長打率
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													OPS
												</TableCell>
												<TableCell align='center' sx={{ py: 1 }}>
													操作
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{displayBatters.map((player) => (
												<TableRow key={player.id} hover>
													<TableCell sx={{ py: 0.75, textAlign: 'center' }}>
														<IconButton size='small'>
															<DragIcon />
														</IconButton>
													</TableCell>
													<TableCell>
														<Typography variant='body2' fontWeight='medium'>
															{player.name}
														</Typography>
													</TableCell>
													<TableCell sx={{ py: 0.75, textAlign: 'center' }}>
														{isEditing ? (
															<TextField
																type='number'
																value={player.order ?? ''}
																onChange={(e) =>
																	updateBatterStat(
																		player.id,
																		'order',
																		e.target.value
																			? parseInt(e.target.value)
																			: null
																	)
																}
																size='small'
																sx={{ width: 70 }}
																placeholder='打順'
															/>
														) : (
															<Typography variant='body2' fontWeight='medium'>
																{player.order ? `${player.order}番` : 'ベンチ'}
															</Typography>
														)}
													</TableCell>
													<TableCell sx={{ py: 0.75, textAlign: 'center' }}>
														{BATTER_POSITIONS.find(
															(p) => p.value === player.position
														)?.label || '--'}
													</TableCell>
													<TableCell align='right' sx={{ py: 0.75 }}>
														{isEditing ? (
															<TextField
																type='number'
																value={player.atBats}
																onChange={(e) =>
																	updateBatterStat(
																		player.id,
																		'atBats',
																		parseInt(e.target.value) || 0
																	)
																}
																size='small'
																sx={{ width: 70 }}
															/>
														) : (
															player.atBats
														)}
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing ? (
															<TextField
																type='number'
																value={player.hits}
																onChange={(e) =>
																	updateBatterStat(
																		player.id,
																		'hits',
																		parseInt(e.target.value) || 0
																	)
																}
																size='small'
																sx={{ width: 70 }}
															/>
														) : (
															player.hits
														)}
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing ? (
															<TextField
																type='number'
																value={player.doubles}
																onChange={(e) =>
																	updateBatterStat(
																		player.id,
																		'doubles',
																		parseInt(e.target.value) || 0
																	)
																}
																size='small'
																sx={{ width: 70 }}
															/>
														) : (
															player.doubles
														)}
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing ? (
															<TextField
																type='number'
																value={player.triples}
																onChange={(e) =>
																	updateBatterStat(
																		player.id,
																		'triples',
																		parseInt(e.target.value) || 0
																	)
																}
																size='small'
																sx={{ width: 70 }}
															/>
														) : (
															player.triples
														)}
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing ? (
															<TextField
																type='number'
																value={player.homeRuns}
																onChange={(e) =>
																	updateBatterStat(
																		player.id,
																		'homeRuns',
																		parseInt(e.target.value) || 0
																	)
																}
																size='small'
																sx={{ width: 70 }}
															/>
														) : (
															player.homeRuns
														)}
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing ? (
															<TextField
																type='number'
																value={player.rbi}
																onChange={(e) =>
																	updateBatterStat(
																		player.id,
																		'rbi',
																		parseInt(e.target.value) || 0
																	)
																}
																size='small'
																sx={{ width: 70 }}
															/>
														) : (
															player.rbi
														)}
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														<Typography
															variant='body2'
															color={
																calculateAverage({
																	atBats: player.atBats,
																	hits: player.hits,
																	doubles: player.doubles,
																	triples: player.triples,
																	homeRuns: player.homeRuns,
																}) >= 0.3
																	? 'success.main'
																	: 'text.primary'
															}
															fontWeight='medium'
														>
															{calculateAverage({
																atBats: player.atBats,
																hits: player.hits,
																doubles: player.doubles,
																triples: player.triples,
																homeRuns: player.homeRuns,
															}).toFixed(3)}
														</Typography>
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														<Typography
															variant='body2'
															color={
																calculateSLG({
																	atBats: player.atBats,
																	hits: player.hits,
																	doubles: player.doubles,
																	triples: player.triples,
																	homeRuns: player.homeRuns,
																}) >= 0.3
																	? 'success.main'
																	: 'text.primary'
															}
															fontWeight='medium'
														>
															{calculateSLG({
																atBats: player.atBats,
																hits: player.hits,
																doubles: player.doubles,
																triples: player.triples,
																homeRuns: player.homeRuns,
															}).toFixed(3)}
														</Typography>
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{calculateOPS({
															atBats: player.atBats,
															hits: player.hits,
															doubles: player.doubles,
															triples: player.triples,
															homeRuns: player.homeRuns,
														}).toFixed(3)}
													</TableCell>
													<TableCell
														align='center'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing && (
															<Typography variant='caption' color='primary'>
																編集中
															</Typography>
														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</>
					)}

					{/* 投手テーブル */}
					{activeTab === 1 && (
						<>
							{displayPitchers.length === 0 ? (
								<Box textAlign='center' py={4}>
									<Typography color='text.secondary'>
										投手データがありません
									</Typography>
								</Box>
							) : (
								<TableContainer sx={{ mt: 1.5 }}>
									<Table size='small'>
										<TableHead>
											<TableRow>
												<TableCell
													sx={{ py: 1, textAlign: 'center' }}
												></TableCell>
												<TableCell sx={{ py: 1, textAlign: 'center' }}>
													選手名
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													オーダー
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													役割
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													勝利
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													敗北
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													セーブ
												</TableCell>
												<TableCell
													align='right'
													sx={{ py: 1, textAlign: 'center' }}
												>
													勝率
												</TableCell>
												<TableCell
													align='center'
													sx={{ py: 1, textAlign: 'center' }}
												>
													操作
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{displayPitchers.map((player) => (
												<TableRow key={player.id} hover>
													<TableCell sx={{ py: 0.75, textAlign: 'center' }}>
														<IconButton size='small'>
															<DragIcon />
														</IconButton>
													</TableCell>
													<TableCell sx={{ py: 0.75, textAlign: 'center' }}>
														<Typography variant='body2' fontWeight='medium'>
															{player.name}
														</Typography>
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing ? (
															<TextField
																type='number'
																value={player.order ?? ''}
																onChange={(e) =>
																	updatePitcherStat(
																		player.id,
																		'order',
																		e.target.value
																			? parseInt(e.target.value)
																			: null
																	)
																}
																size='small'
																sx={{ width: 70 }}
																placeholder='打順'
															/>
														) : (
															<Typography variant='body2' fontWeight='medium'>
																{player.order ? `${player.order}` : 'ベンチ'}
															</Typography>
														)}
													</TableCell>
													<TableCell sx={{ py: 0.75, textAlign: 'center' }}>
														<Typography variant='body2' fontWeight='medium'>
															{PITCHER_POSITIONS.find(
																(p) => p.value === player.position
															)?.label || '--'}
														</Typography>
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing ? (
															<TextField
																type='number'
																value={player.wins}
																onChange={(e) =>
																	updatePitcherStat(
																		player.id,
																		'wins',
																		parseInt(e.target.value) || 0
																	)
																}
																size='small'
																sx={{ width: 70 }}
															/>
														) : (
															player.wins
														)}
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing ? (
															<TextField
																type='number'
																value={player.losses}
																onChange={(e) =>
																	updatePitcherStat(
																		player.id,
																		'losses',
																		parseInt(e.target.value) || 0
																	)
																}
																size='small'
																sx={{ width: 70 }}
															/>
														) : (
															player.losses
														)}
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing ? (
															<TextField
																type='number'
																value={player.saves}
																onChange={(e) =>
																	updatePitcherStat(
																		player.id,
																		'saves',
																		parseInt(e.target.value) || 0
																	)
																}
																size='small'
																sx={{ width: 70 }}
															/>
														) : (
															player.saves
														)}
													</TableCell>
													<TableCell
														align='right'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														<Typography
															variant='body2'
															color={
																calculateWinRate(player.wins, player.losses) >=
																0.7
																	? 'success.main'
																	: 'text.primary'
															}
															fontWeight='medium'
														>
															{calculateWinRate(
																player.wins,
																player.losses
															).toFixed(3)}
														</Typography>
													</TableCell>
													<TableCell
														align='center'
														sx={{ py: 0.75, textAlign: 'center' }}
													>
														{isEditing && (
															<Typography variant='caption' color='primary'>
																編集中
															</Typography>
														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</>
					)}
				</Box>
			</Paper>

			{/* チーム戦績編集ダイアログ */}
			<Dialog
				open={teamRecordEditOpen}
				onClose={() => setTeamRecordEditOpen(false)}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle sx={{ pb: 1 }}>チーム戦績編集</DialogTitle>
				<DialogContent sx={{ pt: 1 }}>
					<Box
						component='form'
						sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}
					>
						<TextField
							label='勝利数'
							type='number'
							value={teamRecord.wins}
							onChange={(e) =>
								setTeamRecord({
									...teamRecord,
									wins: parseInt(e.target.value) || 0,
								})
							}
							fullWidth
						/>
						<TextField
							label='敗北数'
							type='number'
							value={teamRecord.losses}
							onChange={(e) =>
								setTeamRecord({
									...teamRecord,
									losses: parseInt(e.target.value) || 0,
								})
							}
							fullWidth
						/>
						<TextField
							label='現在のランク'
							value={teamRecord.currentRank}
							onChange={(e) =>
								setTeamRecord({
									...teamRecord,
									currentRank: e.target.value,
								})
							}
							fullWidth
						/>
						<TextField
							label='連勝記録'
							type='number'
							value={teamRecord.winStreak}
							onChange={(e) =>
								setTeamRecord({
									...teamRecord,
									winStreak: parseInt(e.target.value) || 0,
								})
							}
							fullWidth
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setTeamRecordEditOpen(false)}>
						キャンセル
					</Button>
					<Button
						onClick={() => setTeamRecordEditOpen(false)}
						variant='contained'
					>
						保存
					</Button>
				</DialogActions>
			</Dialog>
		</main>
	);
}
