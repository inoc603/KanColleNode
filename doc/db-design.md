Database design
===============

TABLE SHIPS
-----------
|field	|type		|constraint
|-------|-----------|----------
|id		|INT		|PRIMARY KEY
|name	|TEXT		|
|type	|INT		|FORIEGN KEY SHIP_TYPES(id)
|yomi	|TEXT		|
|afterlv|INT		|
|speed	|INT		|

TABLE SHIP_TYPES
---------------
|field	|type		|constraint
|-------|-----------|----------
|id		|INT		|PRIMARY KEY
|name	|TEXT		|

TABLE QUESTS
------------
|field	|type		|constraint
|-------|-----------|----------
|id		|INT		|PRIMARY KEY
|name	|TEXT		|
|