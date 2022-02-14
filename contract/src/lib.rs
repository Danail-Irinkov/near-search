use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::Base64VecU8;
// use near_sdk::near_bindgen;
use near_sdk::{env, near_bindgen, AccountId};

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct NearSearch;

#[near_bindgen]
impl NearSearch {
    // #[payable]
	pub fn call_contract(&mut self, account_id: AccountId, method_name: Base64VecU8, arguments: Base64VecU8) {
        // Todo: if there is an error should return the deposit back to the sender
        
        if env::predecessor_account_id() == env::current_account_id() {
            env::log(format!("Cannot \"call_contract\" from \"call_contrac\"").as_bytes());
            return;
        }

        let amount = env::attached_deposit();
        let gas = env::prepaid_gas();
		let promise_index = env::promise_create(account_id, &method_name.0, &arguments.0, amount, gas);
        env::promise_return(promise_index);
	}
}
