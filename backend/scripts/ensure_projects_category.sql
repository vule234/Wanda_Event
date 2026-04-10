alter table public.projects
  add column if not exists category text;

update public.projects
set category = 'Other'
where category is null
   or btrim(category) = '';

alter table public.projects
  drop constraint if exists projects_category_check;

alter table public.projects
  add constraint projects_category_check
  check (
    category in (
      'Wedding',
      'Corporate',
      'Birthday',
      'Graduation',
      'Festival',
      'Exhibition',
      'School',
      'Other'
    )
  );

alter table public.projects
  alter column category set default 'Other';

create index if not exists projects_category_idx
  on public.projects (category);
