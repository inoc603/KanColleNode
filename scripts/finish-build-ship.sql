UPDATE OR IGNORE build_log
SET is_complete = 1
WHERE time=(
    SELECT time FROM build_log
    WHERE dock=$dock
    AND is_complete=0
    ORDER BY time DESC
    LIMIT 1
);