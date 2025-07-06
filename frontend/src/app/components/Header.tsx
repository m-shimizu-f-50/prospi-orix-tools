'use client'; // usePathnameを使用するために必要
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

export default function Header() {
	const router = useRouter();
	const pathName = usePathname();
	const [value, setValue] = useState(0);

	const navList = [
		{
			url: '/',
			title: 'トップ',
		},
		{
			url: '/players',
			title: '選手一覧',
		},
	];

	// 現在のパスに基づいてタブの値を設定
	useEffect(() => {
		const currentIndex = navList.findIndex((nav) => nav.url === pathName);
		setValue(currentIndex >= 0 ? currentIndex : 0);
	}, [pathName]);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		router.push(navList[newValue].url);
	};

	return (
		<header className='border-b shadow-sm'>
			{/* タイトル */}
			<div className='px-2 py-5'>
				<Typography
					variant='h6'
					component='h1'
					className='text-lg font-semibold'
				>
					プロスピA | オリックス純正
				</Typography>
			</div>
			{/* 下部：メインメニュー */}
			<Box
				sx={{
					borderTop: 1,
					borderColor: 'divider',
					bgcolor: 'background.paper',
				}}
			>
				<Tabs
					value={value}
					onChange={handleChange}
					variant='scrollable'
					scrollButtons='auto'
					sx={{
						'& .MuiTab-root': {
							fontWeight: 600,
							fontSize: '0.875rem',
							textTransform: 'none',
							minHeight: '48px',
							padding: '12px 16px',
							color: '#4b5563', // gray-700
						},
						'& .MuiTabs-indicator': {
							backgroundColor: '#fbbf24', // yellow-400
							height: '4px',
						},
					}}
				>
					{navList.map((nav) => (
						<Tab key={nav.title} label={nav.title} />
					))}
				</Tabs>
			</Box>
		</header>
	);
}
