module nft_payment::product_nft {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::event;

    // ========== Struct Definitions ==========
    
    /// Ana Product NFT yapısı
     public struct ProductNFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
        original_price: u64,
        current_price: u64,
        category: String,
        is_authentic: bool,
        creation_timestamp: u64,
        ownership_history: vector<address>,
    }

    /// Satıcı profili
     public struct SellerProfile has key {
        id: UID,
        owner: address,
        total_sales: u64,
        total_reviews: u64,
        rating_sum: u64,
        reviews: vector<Review>,
    }

    /// Yorum yapısı
    public struct Review has store, copy, drop {
        reviewer: address,
        rating: u8,
        comment: String,
        timestamp: u64,
    }

    // ========== Events ==========
    
   public struct NFTMinted has copy, drop {
        nft_id: ID,
        creator: address,
        name: String,
    }

   public struct NFTTransferred has copy, drop {
        nft_id: ID,
        from: address,
        to: address,
        price: u64,
    }

   public struct ReviewAdded has copy, drop {
        seller: address,
        reviewer: address,
        rating: u8,
    }

    // ========== Functions ==========

    /// Yeni bir ürün NFT'si oluştur
    public entry fun mint_product_nft(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        price: u64,
        category: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft_id = object::new(ctx);
        let nft_id_copy = object::uid_to_inner(&nft_id);
        
        let mut ownership_hist = vector::empty<address>();
        vector::push_back(&mut ownership_hist, sender);

        let nft = ProductNFT {
            id: nft_id,
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: string::utf8(image_url),
            original_price: price,
            current_price: price,
            category: string::utf8(category),
            is_authentic: true,
            creation_timestamp: tx_context::epoch(ctx),
            ownership_history: ownership_hist,
        };

        event::emit(NFTMinted {
            nft_id: nft_id_copy,
            creator: sender,
            name: string::utf8(name),
        });

        transfer::public_transfer(nft, sender);
    }

    /// Satıcı profili oluştur
    public entry fun create_seller_profile(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        let profile = SellerProfile {
            id: object::new(ctx),
            owner: sender,
            total_sales: 0,
            total_reviews: 0,
            rating_sum: 0,
            reviews: vector::empty<Review>(),
        };

        transfer::transfer(profile, sender);
    }
/// NFT'yi yeni sahibine transfer et
    public entry fun transfer_nft(
        mut nft: ProductNFT,
        new_price: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft_id = object::id(&nft);
        
        // Yeni sahibi geçmişe ekle
        vector::push_back(&mut nft.ownership_history, recipient);
        
        // Fiyatı güncelle
        nft.current_price = new_price;

        event::emit(NFTTransferred {
            nft_id,
            from: sender,
            to: recipient,
            price: new_price,
        });

        transfer::public_transfer(nft, recipient);
    }
  

    /// Satıcıya yorum yap
    public entry fun add_review(
        profile: &mut SellerProfile,
        rating: u8,
        comment: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(rating >= 1 && rating <= 5, 0);
        
        let reviewer = tx_context::sender(ctx);
        
        let review = Review {
            reviewer,
            rating,
            comment: string::utf8(comment),
            timestamp: tx_context::epoch(ctx),
        };

        vector::push_back(&mut profile.reviews, review);
        profile.total_reviews = profile.total_reviews + 1;
        profile.rating_sum = profile.rating_sum + (rating as u64);
        
        event::emit(ReviewAdded {
            seller: profile.owner,
            reviewer,
            rating,
        });
    }

    /// Satış sayısını artır
    public entry fun increment_sales(profile: &mut SellerProfile) {
        profile.total_sales = profile.total_sales + 1;
    }

    // ========== Getter Functions ==========

    public fun get_nft_name(nft: &ProductNFT): String {
        nft.name
    }

    public fun get_ownership_history(nft: &ProductNFT): &vector<address> {
        &nft.ownership_history
    }

    public fun get_seller_rating(profile: &SellerProfile): u64 {
        if (profile.total_reviews == 0) {
            return 0
        };
        profile.rating_sum / profile.total_reviews
    }

    public fun is_authentic(nft: &ProductNFT): bool {
        nft.is_authentic
    }
}