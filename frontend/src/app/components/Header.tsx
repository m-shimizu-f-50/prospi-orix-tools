'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
	const pathName = usePathname(); // 現在のURLパスを取得
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

	return (
		<header className='border-b shadow-sm'>
			{/* タイトル */}
			<div className='px-2 py-5'>
				<h1 className='text-lg font-semibold'>プロスピA | オリックス純正</h1>
			</div>
			{/* 下部：メインメニュー */}
			<nav className='bg-white border-t border-gray-200'>
				<ul className='flex px-4 pt-2 space-x-4 font-semibold text-sm overflow-x-auto'>
					{navList.map((nav) => (
						<li key={nav.title}>
							<Link
								href={nav.url}
								className={`relative inline-block px-4 pb-2 transition-colors duration-200 ${
									pathName === nav.url
										? "after:content-[''] after:absolute after:left-1/2 after:translate-x-[-50%] after:bottom-0 after:h-[4px] after:w-full after:bg-yellow-400"
										: ' hover:after:content-[""] hover:after:absolute hover:after:left-1/2 hover:after:translate-x-[-50%] hover:after:bottom-0 hover:after:h-[4px] hover:after:w-full hover:after:bg-yellow-400'
								}`}
							>
								{nav.title}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}
