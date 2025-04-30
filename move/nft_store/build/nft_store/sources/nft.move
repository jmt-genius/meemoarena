module nft_store::nft {
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::package;
    use sui::display;
    use sui::transfer;
    use sui::event;
    use std::string::{Self, String};
    use sui::url::{Self, Url};

    /// The NFT type
    struct DigitalArt has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        creator: address,
    }

    /// One-Time-Witness for the module
    struct NFT has drop {}

    // ===== Events =====
    struct NFTMinted has copy, drop {
        nft_id: address,
        creator: address,
        name: String,
    }

    fun init(otw: NFT, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);

        // Create the Display for NFTs
        let display = display::new<DigitalArt>(&publisher, ctx);
        
        display::add(&mut display, string::utf8(b"name"), string::utf8(b"{name}"));
        display::add(&mut display, string::utf8(b"description"), string::utf8(b"{description}"));
        display::add(&mut display, string::utf8(b"image_url"), string::utf8(b"{url}"));
        display::add(&mut display, string::utf8(b"creator"), string::utf8(b"{creator}"));

        display::update_version(&mut display);
        
        transfer::public_transfer(display, tx_context::sender(ctx));
        transfer::public_transfer(publisher, tx_context::sender(ctx));
    }

    /// Mint a new NFT - now public without requiring MintCap
    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        let nft = DigitalArt {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            creator: sender,
        };

        // Emit mint event
        let nft_id = object::uid_to_address(&nft.id);
        event::emit(NFTMinted {
            nft_id,
            creator: sender,
            name: nft.name,
        });

        transfer::public_transfer(nft, sender);
    }

    /// View function to get NFT info
    public fun get_nft_info(nft: &DigitalArt): (String, String, Url, address) {
        (nft.name, nft.description, nft.url, nft.creator)
    }
} 