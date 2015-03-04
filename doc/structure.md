#Structure design

##Client

- **/index** \- Temporary index page, provide links to other pages.

- **/game** \- The actual page user will use. It contains the game window and
othre monitoring sections.

- **/debug** \- Page used when debugging, in order to prevent the page from
reloading too often.

- **/error** \- Error page handling common errors.

##Communication Channel

- **/bind_client** \- Used to bind client with the admiral in its current
game.

- **/update/[client_num]** \- Used to listen for update from the server.