CREATE TABLE IF NOT EXISTS battle_log (
    time DATE,
    map_area INT,
    map_number INT,
    map_point INT,
    enemy_id INT,
    rank INT,
    mvp_id INT,
    mvp_name INT,
    get_ship_name TEXT
);

CREATE TABLE IF NOT EXISTS build_log (
    time DATE,
    dock INT,
    is_large BOOLEAN,
    get_ship_name TEXT,
    get_ship_type INT,
    fuel INT,
    ammo INT,
    steel INT,
    aluminium INT,
    material INT
);