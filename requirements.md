# Webプレゼンアプリ 要件定義

## 🎯 目的

Web上でMarkdown形式で記述するだけで、リアルタイムにスライドとしてプレビュー・生成・PDF出力できるアプリを作成する。

---

## 🧩 コア機能（MVP範囲）

### 1. Markdown入力

- ブラウザ上でMarkdownを編集（VSCode風 or シンプルエディタ）
- サポート記法：見出し、リスト、コード、画像、リンク、水平線、区切り（`---`）
- 画像挿入はドラッグ＆ドロップ／コピペに対応
  - 将来的にSupabase StorageへアップロードしてURL挿入に切り替え
  - 保存機能未対応の場合は`URL.createObjectURL()`による一時URLで表示（リロード時に失われるが許容）

### 2. スライドプレビュー

- Markdown → スライド変換（`---`で1ページ）
- リアルタイムレンダリング
- スライドテーマ（ダーク・ライト切り替えは後回し）
- Markdownはremarkでパース、HTML出力にはrehype + sanitizeを使用（`dangerouslySetInnerHTML`回避）

### 3. PDF出力

- スライド全体を1つのPDFにエクスポート
- ページ単位に分割される形式
- オプション：用紙サイズ、余白調整など（後回しでもOK）

---

## 🛠 技術構成

### フロントエンド

- Next.js (App Router)
- React（+ Tailwind CSS）
- 状態管理：useState / useContext（必要ならZustand）

### Markdown処理

- 入力：React SimpleMDE (EasyMDE)
- 変換：remark + rehype + rehype-sanitize（`dangerouslySetInnerHTML`は使用しない）
- スライド：reveal.js（HTMLスライド＋PDF出力に強い）

### PDF出力

- reveal.js の print-pdf 機能（テーマCSSでPDF向けスタイル調整）
- ブラウザ印刷機能（window\.print()）

---

## 🖼 UI構成

### 1. ダッシュボード画面（後回しでもOK）

- スライド一覧
- 作成／編集ボタン

### 2. スライド編集画面（MVP対象）

```
+-----------------------------+
| [Header - アプリ名 + 保存ボタン] |
+-----------------------------+
| Markdown Editor | Slide Preview |
|   (左ペイン)     |   (右ペイン)   |
+-----------------------------+
|         [PDF出力ボタン]         |
+-----------------------------+
```

---

## 💡 補足仕様

- スライド区切り：`---` を基準（簡単で明示的）
- PDF出力はCtrl+Pによる印刷にも対応
- ダークモードは最初から反映（Tailwindで管理）
- Markdownエディタは構造を意識した入力のため、素のMarkdown編集を採用する。初期段階ではリアルタイムプレビューによって構文の理解を補助し、将来的にWYSIWYG的な入力UIの追加を検討する。
- **ログインユーザーはスライドと画像の保存が可能**とし、**ログインなしユーザーは保存はできないが、Markdown記述とPDF出力は可能**とする。これにより、試用・即席プレゼン生成の体験も担保する。

