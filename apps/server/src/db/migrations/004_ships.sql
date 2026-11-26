-- Schiffe zuhause und Schiffsaufträge der Werft
alter table players add column ships jsonb not null default '{}';
alter table jobs drop constraint jobs_kind_check;
alter table jobs add constraint jobs_kind_check check (kind in ('building', 'collector', 'ship'));
