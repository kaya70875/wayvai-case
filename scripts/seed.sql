CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand TEXT NOT NULL,
    objective TEXT NOT NULL,
    niches TEXT[] NOT NULL,
    target_country TEXT NOT NULL,
    min_avg_watch_time INTEGER DEFAULT 0,
    preferred_hook_types TEXT[] NOT NULL,
    tone TEXT DEFAULT 'professional',
    do_not_use_words TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    niches TEXT[] NOT NULL,
    audience JSONB NOT NULL DEFAULT '{"topCountries": []}',
    engagement_rate FLOAT DEFAULT 0,
    avg_watch_time INTEGER DEFAULT 0,
    primary_hook_type TEXT NOT NULL,
    brand_safety_flags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_briefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    brief_content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, creator_id)
);