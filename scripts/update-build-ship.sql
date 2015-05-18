UPDATE OR IGNORE build_log
SET get_ship_name=$get_ship_name
  , get_ship_type=$get_ship_type
WHERE time=(
    SELECT time FROM build_log
    WHERE dock=$dock
    AND is_complete=0
    ORDER BY time DESC
    LIMIT 1
);