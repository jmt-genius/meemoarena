// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// This example demonstrates a basic use of a shared object.
/// Rules:
/// - anyone can create and share a counter
/// - everyone can increment a counter by 1
/// - the owner of the counter can reset it to any value
module MemeVirality::MemeVirality {

    
    
    
    use sui::coin::{Coin};
    use sui::sui::SUI;
    use sui::table::{Table};
    use sui::balance::{Self, Balance};
    

    #[allow(unused_field)]
    public struct Poll has key, store {
        id: UID,
        poll_id: u64,
        owner: address,
        question: vector<u8>,
        options: vector<Option>,
        claimed: bool,
        balance: Balance<SUI>,
    }

    public struct Option has store {
        name: vector<u8>,
        content_id: vector<u8>,
        total_stake: u64,
        user_stakes: Table<address, u64>,
    }

    public struct PollCollection has key {
        id: UID,
        polls: Table<u64, Poll>,
        next_poll_id: u64,
    }

    // Error codes
    const EAlreadyClaimed: u64 = 1;

    fun init(ctx: &mut TxContext) {
        let collection = PollCollection {
            id: sui::object::new(ctx),
            polls: sui::table::new(ctx),
            next_poll_id: 0,
        };
        sui::transfer::share_object(collection);
    }

    public entry fun create_poll(
        collection: &mut PollCollection,
        question: vector<u8>,
        option1_name: vector<u8>,
        option1_content_id: vector<u8>,
        option2_name: vector<u8>,
        option2_content_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let mut options = std::vector::empty();
        std::vector::push_back(&mut options, Option { 
            name: option1_name, 
            content_id: option1_content_id, 
            total_stake: 0,
            user_stakes: sui::table::new(ctx),
        });
        std::vector::push_back(&mut options, Option { 
            name: option2_name, 
            content_id: option2_content_id, 
            total_stake: 0,
            user_stakes: sui::table::new(ctx),
        });

        let poll = Poll {
            id: sui::object::new(ctx),
            poll_id: collection.next_poll_id,
            owner: sui::tx_context::sender(ctx),
            question,
            options,
            claimed: false,
            balance: sui::balance::zero<SUI>(),
        };

        sui::table::add(&mut collection.polls, collection.next_poll_id, poll);
        collection.next_poll_id = collection.next_poll_id + 1;
    }

    public entry fun stake(
        collection: &mut PollCollection,
        poll_id: u64,
        option_index: u64,
        payment: Coin<SUI>,
        _ctx: &mut TxContext
    ) {
        let poll = sui::table::borrow_mut(&mut collection.polls, poll_id);
        let option = std::vector::borrow_mut(&mut poll.options, option_index);
        let amount = sui::coin::value(&payment);
        
        option.total_stake = option.total_stake + amount;
        
        let sender = sui::tx_context::sender(_ctx);
        let prev = if (sui::table::contains(&option.user_stakes, sender)) {
            sui::table::borrow_mut(&mut option.user_stakes, sender)
        } else {
            sui::table::add(&mut option.user_stakes, sender, 0);
            sui::table::borrow_mut(&mut option.user_stakes, sender)
        };
        *prev = *prev + amount;
        
        let payment_balance = sui::coin::into_balance(payment);
        sui::balance::join(&mut poll.balance, payment_balance);
    }

    public entry fun claim(
        collection: &mut PollCollection,
        poll_id: u64,
        winning_option_index: u64,
        ctx: &mut TxContext
    ) {
        let poll = sui::table::borrow_mut(&mut collection.polls, poll_id);
        assert!(!poll.claimed, EAlreadyClaimed);

        let winning_option = std::vector::borrow(&poll.options, winning_option_index);
        let user = sui::tx_context::sender(ctx);

        let user_stake = if (sui::table::contains(&winning_option.user_stakes, user)) {
            *sui::table::borrow(&winning_option.user_stakes, user)
        } else {
            0
        };
        let total_stake = winning_option.total_stake;

        // Calculate total collected from all options
        let total_collected = std::vector::borrow(&poll.options, 0).total_stake +
            std::vector::borrow(&poll.options, 1).total_stake;

        // Calculate reward proportionally
        let reward_amount = (user_stake as u128) * (total_collected as u128) / (total_stake as u128);

        // Withdraw and transfer reward
        let reward = sui::balance::split(&mut poll.balance, reward_amount as u64);
        let reward_coin = sui::coin::from_balance(reward, ctx);
        sui::transfer::public_transfer(reward_coin, user);

        poll.claimed = true;
    }

    /// Get poll information
    public fun get_poll_info(
        collection: &PollCollection,
        poll_id: u64
    ): (vector<u8>, u64, bool, address) {
        let poll = sui::table::borrow(&collection.polls, poll_id);
        (
            poll.question,
            std::vector::length(&poll.options),
            poll.claimed,
            poll.owner
        )
    }

    /// Get total number of polls
    public fun get_poll_count(collection: &PollCollection): u64 {
        collection.next_poll_id
    }

    /// Get option details
    public fun get_option_details(option: &Option): (vector<u8>, vector<u8>, u64) {
        (
            option.name,
            option.content_id,
            option.total_stake
        )
    }

    /// Get all active polls (not claimed)
    public fun get_active_polls(
        collection: &PollCollection
    ): vector<u64> {
        let mut active_polls = std::vector::empty();
        let mut i = 0;
        while (i < collection.next_poll_id) {
            let poll = sui::table::borrow(&collection.polls, i);
            if (!poll.claimed) {
                std::vector::push_back(&mut active_polls, i);
            };
            i = i + 1;
        };
        active_polls
    }

    // Additional helper functions and logic
}