-- Users table is automatically created by Supabase Auth
-- Reference it as auth.users

-- Daily Games table - tracks each day's game
CREATE TABLE daily_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    target_run_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Games table - tracks user's progress in each daily game
CREATE TABLE user_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    daily_game_id UUID REFERENCES daily_games(id) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    won BOOLEAN DEFAULT FALSE,
    num_guesses INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, daily_game_id)
);

-- Guesses table - tracks each individual guess
CREATE TABLE guesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_game_id UUID REFERENCES user_games(id) NOT NULL,
    run_name TEXT NOT NULL,
    guess_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_game_id, guess_number)
);

-- Create indexes for common queries
CREATE INDEX idx_daily_games_date ON daily_games(date);
CREATE INDEX idx_user_games_user ON user_games(user_id);
CREATE INDEX idx_user_games_daily_game ON user_games(daily_game_id);
CREATE INDEX idx_guesses_run_name ON guesses(run_name);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE guesses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Daily games are viewable by everyone"
    ON daily_games FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "User games are viewable by everyone"
    ON user_games FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can only insert their own games"
    ON user_games FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own games"
    ON user_games FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Guesses are viewable by everyone"
    ON guesses FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can only insert guesses for their own games"
    ON guesses FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_games
            WHERE user_games.id = guesses.user_game_id
            AND user_games.user_id = auth.uid()
        )
    );

-- Functions for leaderboard queries
CREATE OR REPLACE FUNCTION get_daily_leaderboard(target_date DATE)
RETURNS TABLE (
    user_id UUID,
    num_guesses INTEGER,
    won BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT ug.user_id, ug.num_guesses, ug.won
    FROM user_games ug
    JOIN daily_games dg ON ug.daily_game_id = dg.id
    WHERE dg.date = target_date
    AND ug.completed = true
    ORDER BY 
        ug.won DESC,
        ug.num_guesses ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_most_guessed_runs(user_id_param UUID, limit_param INTEGER)
RETURNS TABLE (
    run_name TEXT,
    guess_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT g.run_name, COUNT(*) as guess_count
    FROM guesses g
    JOIN user_games ug ON g.user_game_id = ug.id
    WHERE ug.user_id = user_id_param
    GROUP BY g.run_name
    ORDER BY guess_count DESC
    LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;