use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct NearSearch;

#[near_bindgen]
impl NearSearch {
    #[payable]
	pub fn call_contract(&mut self, account_id: AccountId, method_name: String, args: String) {
        // Todo: if there is an error should return the deposit back to the sender

        let predecessor = env::predecessor_account_id();
        let current = env::current_account_id();

        if predecessor == current {
            env::log("Cannot \"call_contract\" from \"call_contract\"".as_bytes());
            return;
        }

        // this is 0.01 NEAR
        const tax: u128 = 10_000_000_000_000_000_000_000;
        let mut amount = env::attached_deposit();
        if amount > tax {
            Promise::new(current).transfer(tax);
            amount -= tax;
        }

        let gas = env::prepaid_gas();
		let promise_index = env::promise_create(
            account_id,
            method_name.as_bytes(),
            args.as_bytes(),
            amount,
            gas/2
        );
        env::promise_return(promise_index);
	}

    pub fn print_arg(&self, arg: String) {
        env::log(arg.as_bytes());
    }
}
