import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'プロスピA | オリックス純正',
	description: 'プロスピAのオリックス純正チームを応援するためのツール',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ja'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
			>
				<Header />
				<main className='flex-1'>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
