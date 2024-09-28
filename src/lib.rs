use std::io::Read;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct HinodejiTokenizer {
    tokenizer: vibrato::Tokenizer,
}

#[wasm_bindgen]
impl HinodejiTokenizer {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Default::default()
    }

    #[wasm_bindgen]
    pub fn tokenize(&self, text: &str) -> Vec<String> {
        let mut worker = self.tokenizer.new_worker();
        worker.reset_sentence(text);
        worker.tokenize();
        
        // 助詞区切りで分割
        let mut tokens = vec![];
        let mut token = String::new();

        for t in worker.token_iter() {

            let features: Vec<String> = read_one_line_as_csv(t.feature());
            let surface = t.surface().to_string();

            let yomi = features.get(9).unwrap_or(&surface);
            token = format!("{}{}", token, if *yomi == "*" { t.surface() } else { yomi });

            if ["。", "、"].contains(&t.surface()) || features[0] == "助詞" {
                tokens.push(token.clone());
                token.clear();
                continue;
            }
        }

        if !token.is_empty() {
            tokens.push(token);
        }

        tokens
    }
}

impl Default for HinodejiTokenizer {
    fn default() -> Self {
        let dict = {
            let model = include_bytes!("../resources/dict/bccwj-suw+unidic-cwj-3_1_1.zst");
            let mut decorder = ruzstd::StreamingDecoder::new(model.as_slice()).unwrap();
            let mut buf = vec![];
            decorder.read_to_end(&mut buf).unwrap();
            vibrato::Dictionary::read(buf.as_slice()).unwrap()
        };
        let tokenizer = vibrato::Tokenizer::new(dict);
        Self { tokenizer }
    }
}

fn read_one_line_as_csv(text: &str) -> Vec<String> {
    let mut reader = csv::ReaderBuilder::new().has_headers(false).from_reader(text.as_bytes());
    return reader.records().next().unwrap().unwrap().iter().map(|s| s.to_string()).collect();
}

fn get_vowel_of_kana(kana: char) -> String {
    match kana {
        'ア' | 'カ' | 'サ' | 'タ' | 'ナ' | 'ハ' | 'マ' | 'ヤ' | 'ラ' | 'ワ' | 'ガ' | 'ザ' | 'ダ' | 'バ' | 'パ' => "ア".to_string(),
        'イ' | 'キ' | 'シ' | 'チ' | 'ニ' | 'ヒ' | 'ミ' | 'リ' | 'ギ' | 'ジ' | 'ヂ' | 'ビ' | 'ピ' => "イ".to_string(),
        'ウ' | 'ク' | 'ス' | 'ツ' | 'ヌ' | 'フ' | 'ム' | 'ユ' | 'ル' | 'グ' | 'ズ' | 'ヅ' | 'ブ' | 'プ' => "ウ".to_string(),
        'エ' | 'ケ' | 'セ' | 'テ' | 'ネ' | 'ヘ' | 'メ' | 'レ' | 'ゲ' | 'ゼ' | 'デ' | 'ベ' | 'ペ' => "エ".to_string(),
        'オ' | 'コ' | 'ソ' | 'ト' | 'ノ' | 'ホ' | 'モ' | 'ヨ' | 'ロ' | 'ヲ' | 'ゴ' | 'ゾ' | 'ド' | 'ボ' | 'ポ' => "オ".to_string(),
        'ン' => "ン".to_string(),
        'ャ' => "ア".to_string(),
        'ュ' => "ウ".to_string(),
        'ョ' => "オ".to_string(),
        _ => kana.to_string(),
    }
}

#[wasm_bindgen]
pub fn to_hinode(text: &str) -> String {
    let chars = text.chars().collect::<Vec<char>>();
    text.chars().enumerate().map(|(i,c)| if i == 0 { c.to_string() } else if c == 'ー' { get_vowel_of_kana(*chars.get(i-1).unwrap()) } else { c.to_string() }).collect()
}

#[wasm_bindgen]
pub fn sanitize(text: &str) -> String {
    let table = include_str!("../resources/sanitize.txt").lines().map(|line|{
        let mut record = line.split_whitespace();
        let before = record.next().unwrap();
        let after = record.next().unwrap();
        (before.to_string(), after.to_string())
    }).collect::<Vec<(String, String)>>();

    let mut result = text.to_string();
    for (before, after) in table {
        result = result.replace(&before, &after);
    }

    result
}