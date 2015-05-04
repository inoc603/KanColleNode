UPDATE build_log
SET get_ship_name=$
  , get_ship_type=?
WHERE dock=(
    SELECT dock FROM build_log
    WHERE dock=?
    ORDER BY time DESC
    LIMIT 1
);