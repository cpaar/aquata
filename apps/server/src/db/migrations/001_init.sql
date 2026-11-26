-- Runden: alles Spielgeschehen hängt an einer Runde, Konten bleiben über Runden bestehen.
create table rounds (
  id serial primary key,
  name text not null,
  started_at timestamptz not null,
  tick_seconds integer not null,
  status text not null default 'running' check (status in ('running', 'havoc', 'ended'))
);
