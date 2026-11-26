-- Wirtschaft: Rohstoffe werden als Stand + Zeitpunkt gespeichert und bei jedem Zugriff fortgeschrieben.
alter table players
  add column res_alu double precision not null default 0,
  add column res_stahl double precision not null default 0,
  add column res_pu double precision not null default 0,
  add column res_at timestamptz not null default now(),
  add column collectors integer not null default 0,
  add column split jsonb not null default '{"alu":60,"stahl":30,"pu":10}',
  add column buildings jsonb not null default '{"werft":1,"antrieb":0,"sonar":1}';

-- Laufende Aufträge (Gebäude, Sammler; später Schiffe)
create table jobs (
  id serial primary key,
  player_id integer not null references players(id) on delete cascade,
  kind text not null check (kind in ('building', 'collector')),
  item text,
  level integer,
  amount integer,
  started_at timestamptz not null,
  finishes_at timestamptz not null
);
create index jobs_player on jobs(player_id);
