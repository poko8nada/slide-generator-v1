# Webプレゼンアプリ 要件定義

## 🎯 目的
Web上でMarkdown形式で記述するだけで、リアルタイムにスライドとしてプレビュー・生成・PDF出力できるアプリを作成する。

---

## 🧩 コア機能（MVP範囲）

### 1. Markdown入力
- ブラウザ上でMarkdownを編集（VSCode風 or シンプルエディタ）
- サポート記法：見出し、リスト、コード、画像、リンク、水平線、区切り（`---`）

### 2. スライドプレビュー
- Markdown → スライド変換（`---`で1ページ）
- リアルタイムレンダリング
- スライドテーマ（ダーク・ライト切り替えは後回し）

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
- 入力：@uiw/react-md-editor
- 変換：remark + rehype + rehype-sanitize
- スライド：reveal.js（HTMLスライド＋PDF出力に強い）

### PDF出力
- reveal.js の print-pdf 機能（テーマCSSでPDF向けスタイル調整）
- ブラウザ印刷機能（window.print()）

### スライドレンダリング
- Markdownは `remark` + `rehype` + `rehype-sanitize` により HTML に変換し、`dangerouslySetInnerHTML` を使って `<section>` ごとのスライドとして挿入する
- Markdown内の `---` を使って `<section>` を分割し、reveal.js の構造 `<div class="reveal"><div class="slides"><section>...</section></div></div>` にマッピング
- rehype-sanitize による無害化を行うことで、XSS対策を担保

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
- MarkdownのHTMLレンダリングには `dangerouslySetInnerHTML` を使用し、`rehype-sanitize` によりセキュリティを確保
- 将来的に共有機能・公開機能などを追加する場合は、sanitize処理の強化・カスタムルールも検討

