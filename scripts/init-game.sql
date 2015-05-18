CREATE TABLE IF NOT EXISTS ships (
    id      INT PRIMARY KEY,
    name    TEXT,
    type    INT,
    yomi    TEXT,
    FOREIGN KEY type REFERENCES ship_types(id)
);

CREATE TABLE IF NOT EXISTS ship_types (
    id      INT PRIMARY KEY,
    name    TEXT
);

CREATE TABLE IF NOT EXISTS equipment (
    id      INT PRIMARY KEY,
    name    TEXT,
    type    INT,
    FOREIGN KEY type REFERENCES equipment_types
);

CREATE TABLE IF NOT EXISTS equipment_types (
    id      INT PRIMARY KEY,
    name    TEXT
);

CREATE TABLE IF NOT EXISTS enemies (
    id              INT PRIMARY KEY,
    name            TEXT,
    formation       INT,
    ship_1          INT,
    ship_2          INT,
    ship_3          INT,
    ship_4          INT,
    ship_5          INT,
    ship_6          INT,
    FOREIGN KEY ship_1 REFERENCES ships(id),
    FOREIGN KEY ship_2 REFERENCES ships(id),
    FOREIGN KEY ship_3 REFERENCES ships(id),
    FOREIGN KEY ship_4 REFERENCES ships(id),
    FOREIGN KEY ship_5 REFERENCES ships(id),
    FOREIGN KEY ship_6 REFERENCES ships(id),
);

CREATE TABLE IF NOT EXISTS quests (
    id          INT PRIMARY KEY,
    name        TEXT,
    type        INT,
    category    INT,
    detail      TEXT
);