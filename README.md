# Wayv AI: Influencer Matching & Briefing System

This project is a high-performance **Full-stack MVP** designed to match brands with the most relevant influencers using a weighted scoring algorithm and generate structured, AI-powered collaboration briefs.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **API Layer:** tRPC (End-to-end typesafety)
- **Database & Auth:** Supabase (PostgreSQL)
- **AI Engine:** DeepSeek AI (via OpenAI SDK)
- **Validation:** Zod (Schema validation & AI output verification)
- **Styling:** Tailwind CSS

---

## Scoring Logic (Algorithm)

The system uses a **Weighted Multi-Criteria Decision Making** model. Each influencer is evaluated out of 100 points based on campaign requirements:

$$Total Score = \sum (Niche_{30} + Audience_{20} + Engagement_{15} + WatchTime_{10} + Hook_{10}) - Penalty_{10}$$

- **Niche Match (30pt):** Relevance between campaign categories and influencer content.
- **Audience Country (20pt):** Geographical alignment of the influencer's top audience.
- **Performance (25pt):** Combined score of Engagement Rate (>5%) and Average Watch Time.
- **Hook Match (10pt):** Alignment of the influencer's primary content style with campaign goals.
- **Brand Safety (-10pt):** Deduction for any automated safety flags.

---

## Key Features & Engineering Decisions

### 1. AI Briefing Engine (JSON Mode)
Unlike standard text generation, this system forces the AI to output **Strict JSON**. 
- **Validation:** Every AI response is validated against a Zod schema.
- **Reliability:** Includes a **Retry/Repair** mechanism to handle malformed JSON responses.
- **Output:** Generates a personalized message, 5 content ideas, and 3 high-conversion hooks.

### 2. Intelligent Caching
To minimize API costs and latency, the system implements a **Composite Caching** strategy:
- Briefs are cached per `campaign_id` + `creator_id`.
- Subsequent requests for the same pairing return instantly from the database without invoking the AI.

### 3. Type-Safe Architecture
Using **tRPC**, the entire application shares types from the database schema to the frontend components, preventing runtime errors and improving developer velocity.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account
- DeepSeek or OpenAI API Key

### Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/wayv-ai-assignment.git
   cd wayv-ai-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   DEEPSEEK_API_KEY=your_api_key
   ```

4. **Database Setup:**
   Run the SQL provided in the `scripts/seed.sql` file in your Supabase SQL Editor.

5. **Seeding**
   Seed your database with command:
   ```bash
   npm run db:seed
   ```
   
7. **Run the app:**
   ```bash
   npm run dev
   ```

---

### Testing
You can run vitest tests with:
```bash
npm run test
```

---

## Trade-offs & Future Optimizations

- **Server-side vs. Database Logic:** Currently, the matching algorithm runs in the Node.js layer for flexibility. For production-scale data (1M+ creators), this would be migrated to **PostgreSQL Functions (RPC)** for better performance.
- **Cache Invalidation:** The current cache is persistent. A production version would include invalidation logic based on campaign updates.
- **UI/UX:** Focused on "Explainable AI" by showing the score breakdown to the user, ensuring transparency in why an influencer was recommended.
- **Gender & Age Granularity:** Not only country-based, but also a sub-category scoring system that perfectly aligns demographic breakdowns (age and gender distribution) with the campaign objective.
- **Dynamic Weighting System:** Instead of fixed weights, a dynamic weighting model can be designed based on the campaign objective (for example, increase the weighting of Engagement if it's "Sales" focused, increase the weighting of Watch Time if it's "Awareness" focused).