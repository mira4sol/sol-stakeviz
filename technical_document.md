# Solana StakeViz: A Real-Time Staking Analytics Dashboard

## Introduction

Solana StakeViz is a comprehensive analytics dashboard designed to provide a clear, real-time snapshot of the Solana network's staking health. The dashboard visualizes validator performance, stake distribution, APY trends, and overall network health, empowering users, stakers, and researchers to make informed decisions and monitor the robustness of the Solana ecosystem.

This write-up details the architectural decisions, data sources, key metrics, and technical solutions that underpin StakeViz, with references to both Solana's official resources and best practices in blockchain analytics.

---

## 1. Design Choices and Architecture

### 1.1. Data Flow and Rate Limiting

#### The Challenge

Solana's public RPC endpoints are rate-limited to prevent abuse and ensure fair access. According to [Solana's official documentation](https://docs.solana.com/cluster/rpc-endpoints), the default rate limit is **100 requests per 10 seconds per IP**. When building a real-time dashboard, especially one that could be accessed by many users, this presents a significant challenge: querying the RPC directly from each client would quickly exhaust the rate limit, resulting in errors and degraded user experience.

#### The Solution

**Server-Side Caching and Aggregation**

- **Initial Approach:** The project began with a React frontend and an Express backend, using WebSockets for real-time updates. However, WebSockets generated excessive traffic, quickly hitting the RPC rate limits.
- **Refined Approach:** The architecture was refactored to use a server (later, Next.js API routes) as a data aggregator and cache. Instead of every user querying the Solana RPC, the server fetches and caches data at controlled intervals (every 2–3 seconds), storing it in memory (and optionally in a lightweight database for persistence).
- **Client Requests:** When a user accesses the dashboard, the frontend fetches data from the server's cache, not directly from the RPC. This dramatically reduces the number of RPC calls and ensures compliance with rate limits.
- **Staking Trends Aggregation:** I aggregate staking history from data base by hourly and stored using supabase for easy query, so we can see the trends of validators by hourly
- 
**Diagram: Data Flow and Caching**

```
+-------------------+        +-------------------+        +-------------------+
|   User Browser    | <----> |   Next.js Server  | <----> |   Solana RPC      |
| (React Frontend)  |        | (API Routes)      |        | (Rate Limited)    |
+-------------------+        +-------------------+        +-------------------+
         |                           |                              |
         |   Fetches cached data     |   Periodically fetches       |
         |   (every 2 second)        |   fresh data (every 2 second)  |
         |-------------------------->|----------------------------->|
         |                           |                              |
         |   Receives fast,          |   Caches and aggregates      |
         |   reliable responses      |   data for all users         |
         +---------------------------+------------------------------+
```

**Why Not WebSockets?**  
WebSockets are ideal for high-frequency, low-latency updates, but in the context of Solana's rate-limited RPC, they are overkill and counterproductive as you hit rate limits (Tho can be overcomed with paid RPC's like helius). A simple `setInterval` on the server, combined with in-memory caching, achieves near real-time updates without overwhelming the RPC.

**References:**
- [Solana RPC Rate Limits](https://docs.solana.com/cluster/rpc-endpoints)
- [Solana Explorer Source (vote-accounts.tsx)](https://github.com/solana-foundation/explorer/blob/master/app/providers/accounts/vote-accounts.tsx)

---

### 1.2. Migration to Next.js

The project was migrated to Next.js, leveraging its server-side API routes for data aggregation and caching. This eliminated the need for a separate Express server, simplifying deployment and maintenance.

- **API Routes:** `/api/solana/validators`, `/api/solana/network`, `/api/solana/history`, etc.
- **Caching:** Data is cached in memory with configurable refresh intervals (e.g., validators every 2-3 seconds or 2-3 seconds, network info every 3 seconds).
- **Frontend Data Fetching:** Uses `react-query` (`useQuery`) for efficient, auto-refreshing data fetching and caching on the client side.

---

## 2. Data Sources

StakeViz aggregates data from the following Solana RPC endpoints:

- **Validators:** `getVoteAccounts` (current and delinquent validators)
- **Network Info:** `getEpochInfo`, `getSupply`, `getSlot`
- **Staking History:** Aggregated and stored hourly by the server for trend analysis

**Additional Research and Inspiration:**
- [Solana Staking Docs](https://solana.com/staking)
- [Validators.app](https://www.validators.app/)
- [Marinade Finance Docs](https://docs.marinade.finance/)
- [Staking Rewards Calculator](https://www.stakingrewards.com/earn/solana/)

---

## 3. Key Metrics and Formulas

### 3.1. Staking Metrics

- **Total Staked SOL:**
  
  `Total Staked = sum of activatedStake for all validators`

- **Staking Ratio:**
  
  `Staking Ratio = (Total Staked / Total Supply) * 100`

- **Active Validators:**
  
  Number of validators not marked as delinquent.

- **Average APY:**
  
  `Average APY = (Sum of APY for all validators) / Number of validators`
  
  (where APY is estimated as a function of base APY and commission)

- **Network Health (Custom Formula):**
  
  ```
  Network Health = (Validator Ratio * 0.5 + Avg Uptime * 0.005) * 100
  where:
    Validator Ratio = Active Validators / Total Validators
    Avg Uptime = Mean uptime across all validators
  ```

### 3.2. Distribution Metrics

- **Stake Distribution:**
  
  Top 20 validators' share of total stake:
  
  `Top 20 Percentage = (Sum of activatedStake for top 20 validators / Total Staked) * 100`

- **Nakamoto Coefficient:**
  
  (Displayed as a static value in the UI, but can be calculated as the minimum number of validators required to reach 33% of total stake.)

- **APY Distribution:**
  
  Validators are bucketed into APY ranges (e.g., 6.5–6.7%, 6.7–6.9%, etc.) for histogram visualization.

### 3.3. Participation and Health

- **Staking Participation:**
  
  `Staking Participation = (Total Staked / Circulating Supply) * 100`

- **Validator Diversity, Voting Performance, Delinquency Rate, Uptime Average, Commission Fairness:**
  
  These are visualized as progress bars and percentages, calculated from validator data.

---

## 4. Dashboard Features and Visualizations

### 4.1. Staking History Analysis

- **Line Chart:** Shows total staked SOL and average APY over time (1M, 3M, 6M, 1Y).
- **Trend Analysis:** Users can observe staking growth, APY fluctuations, and network participation trends.

### 4.2. Distribution Analysis

- **Bar Chart:** Visualizes either the top 20 validators by stake or the distribution of validators by APY range.
- **Key Insights:** Highlights stake concentration and APY fairness.

### 4.3. Network Participation

- **Doughnut Chart:** Breaks down the total supply into staked, unstaked (circulating), and non-circulating SOL.
- **Quick Stats:** Shows current staked, unstaked, and non-circulating amounts in millions of SOL.

### 4.4. Health Indicators

- **Progress Bars:** For validator diversity, voting performance, delinquency rate, staking participation, uptime, and commission fairness.
- **Bottom Cards:** Consensus health, epoch progress, average block time, and security score.

**Diagram: Dashboard Layout**

```
+---------------------------------------------------------------+
| Sidebar |  Analytics Dashboard (Main Content)                 |
|---------+-----------------------------------------------------|
|         |  [Staking History Chart]                            |
|         |  [Distribution Analysis]  [Network Participation]   |
|         |  [Network Health Indicators]                        |
|         |  [Quick Stats Cards]                                |
+---------------------------------------------------------------+
```

---

## 5. How StakeViz Offers a Clear Snapshot of Network Health

- **Real-Time, Reliable Data:** By aggregating and caching data server-side, StakeViz provides up-to-date information without risking RPC rate limits or downtime.
- **Comprehensive Metrics:** The dashboard covers all critical aspects of network health—staking participation, validator performance, stake distribution, APY trends, and more.
- **Visual Clarity:** Interactive charts and progress bars make complex data accessible and actionable for all users.
- **Trend Analysis:** Historical data and trend lines help users spot changes in network health, stake concentration, and validator performance over time.
- **Open Source and Extensible:** The architecture is modular, making it easy to add new metrics or data sources as the Solana ecosystem evolves.

---

## 6. References and Further Reading

- [Solana Staking Overview](https://solana.com/staking)
- [Solana RPC Endpoints and Rate Limits](https://docs.solana.com/cluster/rpc-endpoints)
- [Solana Explorer Source Code](https://github.com/solana-foundation/explorer)
- [Validators.app](https://www.validators.app/)
- [Marinade Finance Docs](https://docs.marinade.finance/)
- [Staking Rewards Calculator](https://www.stakingrewards.com/earn/solana/)

---

## 7. Conclusion

Solana StakeViz is a robust, real-time analytics dashboard that distills the complexity of Solana's staking ecosystem into actionable insights. Through careful architectural choices—especially around rate limiting and data aggregation—it delivers a reliable, scalable, and user-friendly experience. The dashboard's visualizations and metrics empower users to monitor network health, stake wisely, and contribute to the decentralization and security of the Solana blockchain.

---

## 8. Staking Calculator: Interactive Reward Simulation

### Overview

The **Staking Calculator** is an interactive tool that empowers users to estimate their potential staking rewards on the Solana network. By adjusting parameters such as stake amount, validator commission, time period, and compounding strategy, users can model different scenarios and make informed decisions about their staking strategy.

### Key Features

- **User Inputs:**
  - **Amount to Stake (SOL):** The principal amount the user wishes to stake.
  - **Validator Commission (0–10%):** The commission fee set by the validator.
  - **Time Period:** Options from 30 days up to 3 years.
  - **Compounding Frequency:** None, yearly, quarterly, monthly, or daily.
  - **Advanced Options:** Lockup period, unstake fee, reinvestment threshold, APY trend (stable, increasing, decreasing, volatile).

- **Reward Calculation:**
  - Utilizes both client-side logic and a backend API (via the `useAPYCalculator` hook) to estimate APY and rewards.
  - Simulates compounding based on the selected frequency.
  - Models advanced scenarios such as lockup periods (no rewards during lockup), fluctuating APY, and reinvestment thresholds.

- **Results Visualization:**
  - Displays estimated APY, total rewards, final balance, ROI, and annual/monthly breakdowns.
  - Visualizes monthly rewards as a bar chart.
  - Provides a risk assessment based on user parameters.
  - Includes FAQ and disclaimers for user education.

### Example Calculation Logic

- **Compounding (Daily):**
  ```js
  for (let day = 1; day <= totalDays; day++) {
    dailyReward = currentAmount * (APY / 365 / 100);
    currentAmount += dailyReward;
  }
  ```
- **ROI:**
  ```js
  ROI = (TotalRewards / InitialAmount) * 100;
  ```
- **Risk Assessment:**
  - Based on commission, time period, compounding, lockup, APY trend, etc.
  - Categorized as Low, Medium, or High.

### User Experience

- The calculator is accessible from the main dashboard and provides instant feedback as users adjust parameters.
- Advanced options allow power users to model more complex scenarios.
- The FAQ and disclaimers help educate users about staking risks and tax implications.

### Integration with the Dashboard

- The calculator uses the same backend API and hooks as the analytics dashboard, ensuring consistency in APY and network data.
- It complements the analytics dashboard by helping users turn insights into actionable staking plans.

---