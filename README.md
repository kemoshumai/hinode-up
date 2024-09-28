# Hinode-up ひので字変換エンジン

![Hinode-up　ひので字変換エンジン](bar.png)

[Firefoxブラウザにインストールするにはここをクリック！](https://github.com/kemoshumai/hinode-up/releases/latest/download/c134cdeb98c14184bc2e-1.0.xpi)

ウェブサイトをひので字で読めるようになります。

以下の2つから構成されるひので字変換エンジン

1. 日本語を**ひので字の書き方に直す**
    - wasmにビルド可能
    - Rustから利用可能
1. **ウェブサイトをひので字で読めるようになる**ブラウザ拡張機能

ブラウザ拡張機能はウェブサイトをひので字に変換するが、その表示には『[NKC02 Hinodeji](https://umihotaru.work/)』のインストールが必要。

## 例

### 入力：`その晩、私は隣室のアレキサンダー君に案内されて、始めて横浜へ遊びに出かけた。`

ひので字変換としての特徴は以下の通り
- 助詞を含める形で分かち書きする
- 伸ばし棒が母音に直す
- 記述は音に従う
    - 「私は」が「私わ」になる
    - 「横浜へ」が「横浜え」になる

出力：`ソノバン、 ワタクシワ リンシツノ アレキサンダアクンニ アンナイサレテ 、 ハジメテ ヨコハマエ アソビニ デカケタ。`

## Installation

1. Firefoxブラウザにインストールする

    - [Firefoxブラウザにインストールするにはここをクリック](https://github.com/kemoshumai/hinode-up/releases/latest/download/c134cdeb98c14184bc2e-1.0.xpi)

1. 拡張機能をビルドしたい場合は`cargo run`する。
```shell
cargo run 
```

1. 単にひので字変換エンジンを試したい場合は`examples/tokenize.rs`を参照する。
```shell
cargo run --example tokenize
```

1. Rustから利用したい場合は`examples/tokenize.rs`を参考にする。
```Rust
use hinode_up::{sanitize, to_hinode};
```


## 構造
- examples
    - Rustからの利用方法がわかる
- hinode-up
    - ブラウザ拡張機能本体
    - pkgフォルダーがない場合ビルド（`cargo run`）が必要
- resources
    - dict
        - 辞書ファイル
    - sanitize.txt
        - 間違った読み方をしてしまう単語の変換表
- src
    - lib.rs
        - 変換エンジン本体
    - main.rs
        - 拡張機能をビルドするコード
        - **wasm-packのインストールが必須**
- README.md
    - 使い方