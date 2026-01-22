-- 创建锁定月份表
CREATE TABLE IF NOT EXISTS locked_months (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  month_key TEXT NOT NULL, -- 格式: YYYY-MM
  locked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_key)
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_locked_months_user_id ON locked_months(user_id);
CREATE INDEX IF NOT EXISTS idx_locked_months_month_key ON locked_months(month_key);

-- 添加行级安全策略
ALTER TABLE locked_months ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的锁定记录
CREATE POLICY "用户只能访问自己的锁定月份记录" ON locked_months
  FOR ALL USING (auth.uid() = user_id);
