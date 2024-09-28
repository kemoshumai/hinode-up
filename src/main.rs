use std::process::Command;

fn main() {
    let status = Command::new("wasm-pack")
        .args(["build", "--target", "no-modules", "--release","--out-dir", "hinode-up/pkg"])
        .status()
        .unwrap();

    if status.success() {
        println!("ビルドが成功しました！");
        println!("hinode-upディレクトリ内にpkgフォルダが生成され、ブラウザ拡張機能として利用できます。")
    } else {
        eprintln!("ビルドに失敗しました。");
    }
}
