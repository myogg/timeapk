-- 创建工作记录表
CREATE TABLE IF NOT EXISTS work_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_work_records_user_id ON work_records(user_id);
CREATE INDEX IF NOT EXISTS idx_work_records_date ON work_records(date);
CREATE INDEX IF NOT EXISTS idx_work_records_user_date ON work_records(user_id, date);

-- 添加行级安全策略
ALTER TABLE work_records ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的记录
CREATE POLICY "用户只能访问自己的工作记录" ON work_records
  FOR ALL USING (auth.uid() = user_id);

-- 创建触发器以自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_work_records_updated_at 
  BEFORE UPDATE ON work_records 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
