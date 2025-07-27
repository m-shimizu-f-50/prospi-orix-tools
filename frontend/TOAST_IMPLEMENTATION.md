# トースト通知の実装方法

このプロジェクトでは、Material-UI の Snackbar を使用してトースト通知を実装しています。

## 現在の実装

### 1. ToastContext

- ファイル: `src/app/contexts/ToastContext.tsx`
- Material-UI の Snackbar と Alert コンポーネントを使用
- コンテキスト API でアプリ全体でトースト通知を管理

### 2. 使用方法

```tsx
import { useToast } from '@/app/contexts/ToastContext';

export default function MyComponent() {
	const { showToast } = useToast();

	const handleSuccess = () => {
		showToast('成功しました！', 'success');
	};

	const handleError = () => {
		showToast('エラーが発生しました', 'error');
	};

	const handleWarning = () => {
		showToast('警告メッセージ', 'warning');
	};

	const handleInfo = () => {
		showToast('情報メッセージ', 'info');
	};
}
```

### 3. 利用可能な severity

- `success`: 成功メッセージ（緑色）
- `error`: エラーメッセージ（赤色）
- `warning`: 警告メッセージ（オレンジ色）
- `info`: 情報メッセージ（青色）

## 他のライブラリの選択肢

### 1. react-hot-toast

軽量で使いやすいトーストライブラリ

```bash
npm install react-hot-toast
```

```tsx
import toast, { Toaster } from 'react-hot-toast';

// 基本的な使用方法
toast.success('成功しました！');
toast.error('エラーが発生しました');
toast.loading('処理中...');

// カスタマイズ
toast('カスタムメッセージ', {
	duration: 4000,
	position: 'top-right',
	style: {
		background: '#363636',
		color: '#fff',
	},
});
```

### 2. react-toastify

豊富なカスタマイズオプション

```bash
npm install react-toastify
```

```tsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 使用方法
toast.success('成功しました！');
toast.error('エラーが発生しました');
toast.info('情報メッセージ');
toast.warning('警告メッセージ');

// コンテナの配置
<ToastContainer
	position='top-right'
	autoClose={5000}
	hideProgressBar={false}
	newestOnTop={false}
	closeOnClick
	rtl={false}
	pauseOnFocusLoss
	draggable
	pauseOnHover
/>;
```

### 3. sonner

モダンで美しいデザイン

```bash
npm install sonner
```

```tsx
import { toast, Toaster } from 'sonner';

// 使用方法
toast.success('成功しました！');
toast.error('エラーが発生しました');
toast('カスタムメッセージ');

// プロミス対応
toast.promise(fetch('/api/data'), {
	loading: 'データを読み込み中...',
	success: 'データの読み込みが完了しました',
	error: 'データの読み込みに失敗しました',
});
```

## 推奨事項

1. **Material-UI を使用している場合**: 既存の Snackbar を使用（現在の実装）
2. **軽量でシンプルな場合**: react-hot-toast
3. **豊富なカスタマイズが必要な場合**: react-toastify
4. **モダンなデザインを重視する場合**: sonner

## 実装例

実際の使用例は `src/app/components/player/PlayerForm.tsx` を参照してください。
フォーム送信時に成功/エラーのトースト通知が表示されます。
