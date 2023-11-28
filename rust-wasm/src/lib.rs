use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

extern crate console_error_panic_hook;

#[derive(Serialize, Deserialize)]
struct Board(Vec<Vec<Vec<u32>>>);

#[wasm_bindgen]
pub fn solve_rust(board: JsValue, dim: usize) -> JsValue {
    console_error_panic_hook::set_once();
    // log_many("cur_list original: {:?}", board);

    // let cur_list: Vec<Vec<Vec<u32>>> = cur_list.into_serde().unwrap_or_default();
    let mut cur_list: Vec<Vec<Vec<u32>>> = serde_wasm_bindgen::from_value(board.clone()).unwrap();
    println!("RUST_LOG: {:?}", cur_list);
    // log_many("cur_list unwrapped: {:?}", cur_list);
    // cur_list[0][0][0] = 9;
    // log_many("cur_list unwrapped changed: {:?}", cur_list);

    let mut solution_found = false;
    // use BFS to find all solutions
    for i in 0..dim {
        for j in 0..dim {
            if !cur_list.is_empty() {
                let first_board = cur_list[0].clone();
                if first_board[i][j] > 0 {
                    continue; // skip the filled cell
                }
                let mut new_list: Vec<Vec<Vec<u32>>> = vec![];
                for k in 0..cur_list.len() {
                    for v in 1..=dim {
                        if is_valid_number(&cur_list[k], i, j, v as u32) {
                            let mut new_board = deep_copy_2d_number_array(&cur_list[k]);
                            new_board[i][j] = v as u32;
                            new_list.push(new_board);
                        }
                    }
                }
                cur_list = new_list.clone();
                solution_found = true;
            } 
            // else {
            //     // return JsValue::from_serde(&cur_list).unwrap_or_else(|_| JsValue::NULL);
            //     // let result_board = Board(cur_list);
            //     return serde_wasm_bindgen::to_value(&cur_list).unwrap();
            // }
        }
    }
    // // Debug logging
    // let json_string = serde_json::to_string(&cur_list[0]).unwrap();
    // log(&json_string);
    // log(&format!("number of solution {}", cur_list.len()));
    // let js_cur_list: JsValue = JsValue::from_serde(&cur_list).unwrap_or_else(|_| JsValue::NULL);
    // let result_board = Board(cur_list);
    let js_cur_list: JsValue = serde_wasm_bindgen::to_value(&cur_list).unwrap();
    js_cur_list
}

fn deep_copy_2d_number_array(board: &Vec<Vec<u32>>) -> Vec<Vec<u32>> {
    let mut res: Vec<Vec<u32>> = Vec::new();
    for i in 0..9 {
        let row: Vec<u32> = board[i].clone();
        res.push(row);
    }
    res
}

fn is_valid_number(board: &Vec<Vec<u32>>, row: usize, col: usize, val: u32) -> bool {
    for i in 0..board.len() {
        if board[i][col] != 0 && board[i][col] == val {
            return false; // check row
        }
        if board[row][i] != 0 && board[row][i] == val {
            return false; // check column
        }
        if board[3 * (row / 3) + (i / 3)][3 * (col / 3) + (i % 3)] != 0
            && board[3 * (row / 3) + (i / 3)][3 * (col / 3) + (i % 3)] == val
        {
            return false; // check 3*3 block
        }
    }
    true
}

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}
