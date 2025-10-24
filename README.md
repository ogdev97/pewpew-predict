# PewPew - Tinder-like Prediction Market DApp

A mobile-first prediction market dApp with Tinder-style swipe mechanics. Swipe right to predict YES, swipe left to predict NO.

## Features

- 📱 Mobile-first responsive design
- 🎨 Dark themed UI with smooth animations
- 👆 Intuitive swipe mechanics (left/right)
- 💰 Web3 integration with wagmi & RainbowKit
- 🔗 BNB Chain support (BSC Mainnet & Testnet)
- ⚡ Built with Next.js 14, TypeScript, and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi v2, RainbowKit v2
- **Animations**: Framer Motion
- **Package Manager**: Yarn

## Getting Started

### Install Dependencies

```bash
yarn install
```

### Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Important Configuration

Before deploying to production, update the WalletConnect `projectId` in `app/wagmi.ts`:

1. Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Replace `'YOUR_PROJECT_ID'` in `app/wagmi.ts`

## How to Use

1. **Connect Wallet**: Click the connect button in the top-right corner
2. **Swipe Right**: Predict YES on the current market
3. **Swipe Left**: Predict NO on the current market
4. **View Odds**: See current YES/NO odds on each card

## Build for Production

```bash
yarn build
yarn start
```

## Project Structure

```
bnb-predict-app/
├── app/
│   ├── components/
│   │   └── SwipeCards.tsx    # Main swipe card component
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── providers.tsx          # Web3 providers
│   ├── wagmi.ts               # Wagmi configuration
│   └── globals.css            # Global styles
├── public/                    # Static assets
└── package.json
```

## Customization

- **Prediction Markets**: Edit the `predictions` array in `app/components/SwipeCards.tsx`
- **Theme Colors**: Modify `tailwind.config.ts`
- **Chains**: Update chains in `app/wagmi.ts`

## License

MIT

