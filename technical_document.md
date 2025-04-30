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
- **Refined Approach:** The architecture was refactored to use a server (later, Next.js API routes) as a data aggregator and cache. Instead of every user querying the Solana RPC, the server fetches and caches data at controlled intervals (every 1–5 minutes), storing it in memory (and optionally in a lightweight database for persistence).
- **Client Requests:** When a user accesses the dashboard, the frontend fetches data from the server's cache, not directly from the RPC. This dramatically reduces the number of RPC calls and ensures compliance with rate limits.

**Diagram: Data Flow and Caching**

```
+-------------------+        +-------------------+        +-------------------+
|   User Browser    | <----> |   Next.js Server  | <----> |   Solana RPC      |
| (React Frontend)  |        | (API Routes)      |        | (Rate Limited)    |
+-------------------+        +-------------------+        +-------------------+
         |                           |                              |
         |   Fetches cached data     |   Periodically fetches       |
         |   (every 30s–5min)        |   fresh data (every 1–5min)  |
         |-------------------------->|----------------------------->|
         |                           |                              |
         |   Receives fast,          |   Caches and aggregates      |
         |   reliable responses      |   data for all users         |
         +---------------------------+------------------------------+
```

**Why Not WebSockets?**  
WebSockets are ideal for high-frequency, low-latency updates, but in the context of Solana's rate-limited RPC, they are overkill and counterproductive. A simple `setInterval` on the server, combined with in-memory caching, achieves near real-time updates without overwhelming the RPC.

**References:**
- [Solana RPC Rate Limits](https://docs.solana.com/cluster/rpc-endpoints)
- [Solana Explorer Source (vote-accounts.tsx)](https://github.com/solana-foundation/explorer/blob/master/app/providers/accounts/vote-accounts.tsx)

---

### 1.2. Migration to Next.js

The project was migrated to Next.js, leveraging its server-side API routes for data aggregation and caching. This eliminated the need for a separate Express server, simplifying deployment and maintenance.

- **API Routes:** `/api/solana/validators`, `/api/solana/network`, `/api/solana/history`, etc.
- **Caching:** Data is cached in memory with configurable refresh intervals (e.g., validators every 1 minute, network info every 5 minutes).
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
  \[
  \text{Total Staked} = \sum_{v \in \text{validators}} v.\text{activatedStake}
  \]
- **Staking Ratio:**  
  \[
  \text{Staking Ratio} = \frac{\text{Total Staked}}{\text{Total Supply}} \times 100
  \]
- **Active Validators:**  
  Number of validators not marked as delinquent.

- **Average APY:**  
  \[
  \text{Average APY} = \frac{1}{N} \sum_{v \in \text{validators}} v.\text{APY}
  \]
  (where APY is estimated as a function of base APY and commission)

- **Network Health (Custom Formula):**  
  \[
  \text{Network Health} = (\text{Validator Ratio} \times 0.5 + \text{Avg Uptime} \times 0.005) \times 100
  \]
  Where:
  - Validator Ratio = Active Validators / Total Validators
  - Avg Uptime = Mean uptime across all validators

### 3.2. Distribution Metrics

- **Stake Distribution:**  
  Top 20 validators' share of total stake:
  \[
  \text{Top 20 Percentage} = \frac{\sum_{i=1}^{20} v_i.\text{activatedStake}}{\text{Total Staked}} \times 100
  \]
- **Nakamoto Coefficient:**  
  (Displayed as a static value in the UI, but can be calculated as the minimum number of validators required to reach 33% of total stake.)

- **APY Distribution:**  
  Validators are bucketed into APY ranges (e.g., 6.5–6.7%, 6.7–6.9%, etc.) for histogram visualization.

### 3.3. Participation and Health

- **Staking Participation:**  
  \[
  \text{Staking Participation} = \frac{\text{Total Staked}}{\text{Circulating Supply}} \times 100
  \]
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