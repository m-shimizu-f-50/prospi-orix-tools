import PlayerTable from '../components/player/PlayerTable';

export default function Players() {
	return (
		<main className='p-6'>
			<h1 className='text-xl font-bold mb-4'>選手一覧</h1>
			<PlayerTable />
		</main>
	);
}
