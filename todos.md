# Todos by Feature

## 認証・ユーザー管理
- [x] NextAuth.js認証基盤構築（Google OAuth等）
- [x] 認証状態管理・ユーザー情報取得
- [x] ユーザーごとのデータ分離・認可制御
- [ ] プロファイル画面設計
- [ ] プロファイル画面実装（ユーザー情報・ログアウト）

## スライド管理
- [x] スライド・ユーザー型定義（TypeScript）
- [x] Drizzle ORM用DBスキーマ設計（slides, users）
- [x] スライドCRUD API実装（D1+Drizzle）【実装計画作成済み: implementation-plan-day3-slides-crud-api.md】
- [x] APIの型安全化・バリデーション
- [x] スライド保存上限・画像数制限ロジック
- [x] ダッシュボード画面設計
- [x] ダッシュボード画面実装（スライド一覧・作成・削除）
- [x] md一覧シート画面
- [x] スライドプレビュー画面設計
- [x] スライドプレビュー画面実装（ページ送り・レイアウト切替）
- [ ] スライド全画面表示設計（プレビューURL発行）

## Markdown編集・出力
- [x] Markdownエディタ画面設計
- [x] Markdownエディタ画面実装（入力・保存・プレビュー・PDF出力）
- [ ] Markdownパーサ・バリデーション実装
- [ ] スライド形式への変換・即時プレビュー
- [ ] PDF出力機能（レイアウト最適化含む）

## 画像管理
- [ ] Cloudflare Images連携設計・型定義
- [ ] Cloudflare ImagesアップロードAPI実装
- [ ] 画像URLのmd埋め込み処理
- [ ] 非ログイン時の一時URL表示ロジック

## 品質・最適化・テスト
- [ ] パフォーマンス最適化（応答2秒以内）
- [ ] セキュリティ対策（XSS/CSRF, API制御, 画像ホワイトリスト）
- [ ] テスト実装（Jest, React Testing Library）
- [ ] 型安全・保守性・拡張性の担保