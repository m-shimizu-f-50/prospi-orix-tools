import Link from 'next/link';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = [
		{
			title: 'サービス',
			links: [
				{ url: '/players', label: '選手一覧' },
				{ url: '/stats', label: '統計データ' },
				{ url: '/news', label: 'ニュース' },
				{ url: '/analysis', label: '分析ツール' },
			],
		},
		{
			title: 'サポート',
			links: [
				{ url: '/help', label: 'ヘルプ' },
				{ url: '/faq', label: 'よくある質問' },
				{ url: '/support', label: 'サポート' },
				{ url: '/feedback', label: 'フィードバック' },
			],
		},
	];

	return (
		<footer className='bg-gray-900 text-white'>
			{/* メインコンテンツ */}
			<div className='max-w-7xl mx-auto px-4 py-12'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* ブランド情報 */}
					<div className='lg:col-span-1'>
						<h3 className='text-lg font-semibold mb-4'>
							プロスピA | オリックス純正
						</h3>
						<p className='text-gray-300 text-sm mb-4'>
							プロスピA オリックス純正の個人データの分析をするツールです。
							オリックス・バファローズの選手データをまとめていきます。
						</p>
					</div>

					{/* フッターリンク */}
					{footerLinks.map((section) => (
						<div key={section.title}>
							<h4 className='text-md font-semibold mb-4 text-yellow-400'>
								{section.title}
							</h4>
							<ul className='space-y-2'>
								{section.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.url}
											className='text-gray-300 hover:text-white transition-colors duration-200 text-sm'
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			{/* ボトムセクション */}
			<div className='border-t border-gray-800'>
				<div className='max-w-7xl mx-auto px-4 py-6'>
					<div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
						{/* 著作権情報 */}
						<div className='text-gray-400 text-sm'>
							© {currentYear} プロスピA | オリックス純正. All rights reserved.
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
