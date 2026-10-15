export const SCHEMA = `
create table if not exists questions (
  id text primary key,
  category text not null,
  prompt text not null,
  note text,
  strip text[] not null default '{}',
  krill_key text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists answers (
  question_id text not null references questions(id) on delete cascade,
  key text not null,
  display text not null,
  prior_tier int not null,
  source text not null default 'seed',
  status text not null default 'approved',
  created_at timestamptz not null default now(),
  primary key (question_id, key)
);

create table if not exists aliases (
  question_id text not null references questions(id) on delete cascade,
  alias text not null,
  key text not null,
  primary key (question_id, alias)
);

create table if not exists verdicts (
  question_id text not null,
  input_key text not null,
  valid boolean not null,
  canonical_key text,
  reason text,
  created_at timestamptz not null default now(),
  primary key (question_id, input_key)
);

create table if not exists referee_usage (
  player_id text not null,
  day date not null,
  calls int not null default 0,
  primary key (player_id, day)
);

create table if not exists daily_sets (
  day date primary key,
  question_ids text[] not null
);

create table if not exists turns (
  player_id text not null,
  day date not null,
  mode text not null,
  question_id text not null,
  started_at timestamptz not null default now(),
  answered_at timestamptz,
  answer_key text,
  tier int,
  points int,
  primary key (player_id, day, mode, question_id)
);

create table if not exists counts (
  question_id text not null,
  answer_key text not null,
  n int not null default 0,
  primary key (question_id, answer_key)
);

create table if not exists runs (
  player_id text not null,
  day date not null,
  mode text not null default 'daily',
  name text,
  score int not null,
  altitude double precision not null,
  grid text not null,
  created_at timestamptz not null default now(),
  primary key (player_id, day, mode)
);

create index if not exists runs_day_alt on runs (day, mode, altitude desc);
`;
