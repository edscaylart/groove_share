ALTER TABLE listeners ADD CONSTRAINT listeners_user_id_uniq UNIQUE (user_id);
ALTER TABLE users ADD CONSTRAINT spotify_user_id_uniq UNIQUE (spotify_user_id);

create or replace function nearby_users(location text)
returns TABLE (
  id uuid,
  user_id uuid,
  artist_name text,
  song_name text,
  image_uri text,
  url text,
  location geography(POINT),
  user_name text
)
as
$$
    select
      l.id,
      l.user_id,
      l.artist_name,
      l.song_name,
      l.image_uri,
      l.url,
      l.location,
      u.name as user_name
    from listeners l,
         users u
    where l.user_id = u.id
    order by l.location <-> st_geogfromtext(nearby_users.location)
    limit 50;
$$
language sql;