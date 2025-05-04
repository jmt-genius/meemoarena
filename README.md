# MeeMo Arena 🚀

MeeMo Arena is a Web3 platform built on the Sui blockchain where meme lovers can create, stake, and earn with AI-generated NFTs. The platform combines the power of artificial intelligence with blockchain technology to create a unique and engaging experience for users.

## 🌟 Features

### AI NFT Creation 🎨
- Generate unique NFTs using cutting-edge AI technology
- Mint NFTs directly to the Sui blockchain
- Participate in NFT battles

### Staking System 💰
- Stake SUI tokens on community polls
- Vote for favorite memes
- Earn rewards for successful predictions

### Competitive Arena 🏆
- Enter meme battles with AI-generated NFTs
- Compete for community votes
- Claim victory rewards

## 🛠️ Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI
- **Blockchain**: Sui Network
- **Wallet Connection**: @mysten/dapp-kit
- **Routing**: React Router
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm package manager
- Sui wallet (like Sui Wallet or Ethos Wallet)
- Testnet SUI tokens (available from [Sui Faucet](https://faucet.sui.io))

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd meemoarena
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
VITE_TESTNET_COUNTER_PACKAGE_ID=your_package_id
VITE_PINATA_JWT=your_pinata_jwt
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
pnpm dev
```

## 🌐 Deployment

The application is configured for deployment on Vercel. The `vercel.json` file handles client-side routing.

### Environment Variables for Production

Make sure to configure the following environment variables in your Vercel project settings:
- `VITE_TESTNET_COUNTER_PACKAGE_ID`
- `VITE_PINATA_JWT`
- `VITE_GEMINI_API_KEY`

## 🔧 Smart Contract Deployment

### Setting up Sui CLI

1. Install Sui CLI following the [official documentation](https://docs.sui.io/build/install)

2. Configure testnet environment:
```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

3. Create a new address (if needed):
```bash
sui client new-address secp256k1
```

4. Switch to your address:
```bash
sui client switch --address 0xYOUR_ADDRESS
```

### Publishing the Move Package

1. Navigate to the Move directory:
```bash
cd move
```

2. Publish the package:
```bash
sui client publish --gas-budget 100000000 counter
```

3. Update the package ID in your environment variables.

## 📱 Features Overview

### Home Page
- Modern UI with animated components
- Platform feature showcase
- Sui blockchain integration details

### Stake Page
- Meme staking interface
- Community polls
- Reward system

### Claim Page
- Reward claiming interface
- Transaction history
- Stake management

### NFT Battle Page
- AI NFT generation
- Battle system
- Voting mechanism

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚡ Powered by Sui

MeeMo Arena leverages Sui blockchain's features:
- Lightning-fast transactions
- Advanced security
- Low gas fees
- Object-centric architecture
- Move language smart contracts
