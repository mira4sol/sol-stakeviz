# Solana StakeViz

A real-time dashboard for visualizing and understanding the health of Solana's staking ecosystem.

---

## 🚀 Live Demo

[https://sol-stakeviz.vercel.app/](https://sol-stakeviz.vercel.app/)

---

## 🌟 Overview

Solana StakeViz is a powerful, user-friendly dashboard that makes it easy to monitor, analyze, and understand Solana's staking network. Whether you're a new staker, a validator, or a researcher, StakeViz provides instant insights into stake distribution, validator performance, and network participation—all in a visually engaging interface.

---

## ✨ Features

- **Real-Time Analytics:** Up-to-date data on stake distribution, validator stats, and network health.
- **Interactive Visualizations:** Line, bar, and doughnut charts for trends and distributions.
- **Staking Calculator:** Simulate rewards, compounding, and validator commission scenarios.
- **Network Health Indicators:** Quick stats and progress bars for decentralization, performance, and security.
- **FAQ & Education:** Built-in explanations and disclaimers for all users.

---

## 📊 Key Metrics

- **Total Staked SOL**
- **Staking Ratio**
- **Active Validators**
- **Average APY**
- **Stake Distribution (Top 20, Nakamoto Coefficient)**
- **Network Participation**
- **Validator Diversity, Voting Performance, Uptime, Commission Fairness**

---

## 🛠️ Getting Started

Clone the repo and install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Chart.js
- **Backend:** Next.js API routes (serverless), Solana Web3.js, in-memory and optional Supabase caching
- **Data Sources:**
  - Solana RPC endpoints (`getVoteAccounts`, `getEpochInfo`, `getSupply`, etc.)
  - Hourly staking history aggregation
- **Smart Caching:** Periodic server-side fetches to avoid RPC rate limits

---

## 📚 Resources & Attribution

- [Solana Staking Docs](https://solana.com/staking)
- [Solana RPC Endpoints](https://docs.solana.com/cluster/rpc-endpoints)
- [Solana Explorer Source](https://github.com/solana-foundation/explorer)
- [Validators.app](https://www.validators.app/)
- [Marinade Finance Docs](https://docs.marinade.finance/)
- [Staking Rewards Calculator](https://www.stakingrewards.com/earn/solana/)

This project uses open-source components with proper attribution. See code comments for details.

---

## 🤝 Contributing

Pull requests and issues are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

Thanks to @heliuslabs, @thenebulanode, and @SuperteamEarn for supporting the Solana ecosystem and the [REDACTED] Hackathon.
