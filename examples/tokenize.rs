use hinode_up::{HinodejiTokenizer, sanitize, to_hinode};

fn main() {
    let tokenizer = HinodejiTokenizer::new();
    let input = r#"その晩、私は隣室のアレキサンダー君に案内されて、始めて横浜へ遊びに出かけた。"#;
    let tokens = tokenizer.tokenize(&sanitize(input));
    let text = tokens.join(" ");
    let text = to_hinode(&text);
    println!("{}", text);
}
