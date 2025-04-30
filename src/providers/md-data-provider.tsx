import type React from 'react'
import { type ReactNode, createContext, useContext, useState } from 'react'

const initialMdData = `
# Slide 1
## 変数の定義
![](https://placehold.jp/150x700.png)

\`\`\`js
let a = 1;
let b = 2;
let c = x => 1 + 2 + x;
c(3);
\`\`\`
---

# Slide 2
## 実行結果の確認

次に、関数 'c' を使って計算した結果を出力します。

\`\`\`js [1-2|3]
let result = c(3);
console.log(result);
\`\`\`
---

# Slide 3
## テーブル：変数一覧

| 変数名 | 説明             |
|:------|:----------------|
| 'a'   | 最初の値（1）     |
| 'b'   | 2番目の値（2）    |
| 'c'   | 関数：引数に 1+2 を足す |

---

# Slide 4
## よく使うリスト

今回使った構文一覧：

- 変数定義 ('t')
- 関数定義 (アロー関数 =>)
- 関数呼び出し (c(3))
- コンソール出力 (console.log)

---

# Slide 5
## 配列の操作

\`\`\`js [1|2-3]
const values = [1, 2, 3, 4];
const doubled = values.map(v => v * 2);
console.log(doubled);
\`\`\`
---

# Slide 6
## 注意点

**関数の使い方**に注意しましょう：

> 関数は定義しても、**呼び出さないと何も起きません。**

また、console.logを忘れずに使いましょう。

---

# Slide 7
## 少し応用

非同期で足し算をしてみます。

\`\`\`js
async function asyncAdd(a, b) {
  return new Promise(resolve => {
    setTimeout(() => resolve(a + b), 500);
  });
}
\`\`\`
---

# Slide 8
## まとめ

最後に、今回学んだこと：

- 変数と関数の定義
- 配列の操作 ('p')
- 非同期処理 ('e', async/await)
- テーブル・リストの使い方
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
