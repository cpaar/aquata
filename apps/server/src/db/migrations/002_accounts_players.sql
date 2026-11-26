-- Konten bleiben über Runden bestehen; Spielstand hängt am Rundenspieler.
create table accounts (
  id serial primary key,
  email text not null unique,
  name text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table sessions (
  token text primary key,
  account_id integer not null references accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table players (
  id serial primary key,
  round_id integer not null references rounds(id),
  account_id integer references accounts(id),
  is_bot boolean not null default false,
  station_name text not null,
  x integer not null,
  y integer not null,
  joined_at timestamptz not null default now(),
  unique (round_id, account_id)
);
create index players_round on players(round_id);
