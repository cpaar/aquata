-- Flotten, Kampfberichte und Logbuch. Ticks werden der Reihe nach abgearbeitet, auch nach einem Neustart.
alter table rounds add column processed_tick integer not null default 0;

create table fleets (
  id serial primary key,
  round_id integer not null references rounds(id),
  player_id integer not null references players(id) on delete cascade,
  target_id integer not null references players(id) on delete cascade,
  mission text not null check (mission in ('attack', 'defend')),
  -- outbound: fliegt hin · engaged: am Ziel (kämpft bzw. verteidigt) · returning: fliegt heim
  status text not null check (status in ('outbound', 'engaged', 'returning')),
  ships jsonb not null,
  depart_tick integer not null,
  -- outbound: Ankunft am Ziel · returning: Ankunft zuhause
  arrive_tick integer not null,
  warn_tick integer not null,
  fight_ticks integer not null,
  fought integer not null default 0,
  cargo jsonb not null default '{"alu":0,"stahl":0,"pu":0}',
  created_at timestamptz not null default now()
);
create index fleets_round_status on fleets(round_id, status, arrive_tick);
create index fleets_player on fleets(player_id);
create index fleets_target on fleets(target_id);

create table reports (
  id serial primary key,
  round_id integer not null references rounds(id),
  tick integer not null,
  target_id integer not null references players(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table report_readers (
  report_id integer not null references reports(id) on delete cascade,
  player_id integer not null references players(id) on delete cascade,
  side text not null check (side in ('attacker', 'defender')),
  seen boolean not null default false,
  primary key (report_id, player_id)
);

create table logbook (
  id serial primary key,
  player_id integer not null references players(id) on delete cascade,
  tick integer not null,
  kind text not null,
  text text not null,
  report_id integer references reports(id) on delete set null,
  created_at timestamptz not null default now()
);
create index logbook_player on logbook(player_id, id desc);
