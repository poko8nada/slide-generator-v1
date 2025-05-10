import type React from 'react'
import { type ReactNode, createContext, useContext, useState } from 'react'

const initialMdData = `# 📚マークダウンで
# 簡単スライド作成
---

## ✨ 主な特徴

- 📄 **Markdownで編集可能**  
  シンプルな記法でスライドを作成。AIとの相性もバッチリ。

- 🔁 **リアルタイムプレビュー**  
  編集内容は即座にとなりのスライドに反映。プレビューも可能。

- 💾 **PDF出力機能**  
  ワンクリックでスライド資料をPDF化できます。

---

## ✏️ サポートする記法
  - 見出し（'#', '##'など）
  - リスト（順序あり/なし）
  - コードブロック
  - リンク
  - 水平線（'-----'）
  - スライド区切り（'---'）
  - 画像

---

# 見出し h1
## 見出し h2
### 見出し h3
#### 見出し h4

テキストテキストテキスト

**ボールド(太字)**

*イタリック(斜体)*

---

### 引用
> 引用分はこんな感じになります。

<br>

### リスト
* リスト1
* リスト2

<br>
<br>

1. 番号付き1
2. 番号付き2


---

### リンク
 [PokoHanada](https://pokohanada.com)

<br>

### テーブル
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Text     | Text     | Text     |

<br>

### 水平線
-----

---

### モック画像URL
![image](https://placehold.jp/200x200.png)
※一部のURLのみ許可

<br>

### ローカル画像
ローカルファイルの画像を一時ファイルとしてアップロードできます。ドラッグアンドドロップでもOK。

---

### インラインコード
インラインで \`const a = 1;\` を書いたりできます。

<br>

### コードブロック
\`\`\`js
const a = 1;
const b = 2;
const c = x => a + b + x;
let result = c(3);
console.log(result);
\`\`\`

---

## 💡 補足

ログイン機能やスライド保存機能などは今後のバージョンで対応予定です。

---

## 🔗 サイト情報

- 開発者: [PokoHanada](https://pokohanada.com)
- github: [poko8nada](https://github.com/poko8nada)
- バージョン: ver 0.5.0
`

// Create the context
const MdDataContext = createContext<
  | {
      mdData: string
      setMdData: React.Dispatch<React.SetStateAction<string>>
      activeSlideIndex: number
      setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>
    }
  | undefined
>(undefined)

// Provider component
export const MdDataProvider = ({ children }: { children: ReactNode }) => {
  const [mdData, setMdData] = useState<string>(initialMdData)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0) // 編集中のスライド

  return (
    <MdDataContext.Provider
      value={{ mdData, setMdData, activeSlideIndex, setActiveSlideIndex }}
    >
      {children}
    </MdDataContext.Provider>
  )
}

// Custom hook to use the context
export const useMdData = () => {
  const context = useContext(MdDataContext)
  if (!context) {
    throw new Error('useMdData must be used within an MdDataProvider')
  }
  return context
}
