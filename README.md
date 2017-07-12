# Back A Friend #

MySQL version (to make two task results not quite identical - we went a bit different technical and logic ways)
This version max matches requirements provided in PDF document

## Installing / Getting started ##

To check the result you just need to run these two commands:

```
git clone https://github.com/1webdev/back-friend-mysql .

docker-compose up
```

and then use http://localhost:3015 in your browser address bar.


## Testing ##

1. Add/fund players you can do using Add button and decrease points with Take button basing on player ID field
2. Announce the tournament with required deposit amount and also provide tournament ID (according to provided endpoint)
3. Join the tournament:
* Players who have enough points to join the tournament have green Join button and can join it immediately
* Players who haven't enough points can click yellow Back a friend button, after that players who haven't joined the tournament yet will have Back player button (players cannot join the tournament and back another player within the same tournament). After required points amount is rached, player will have green Join button. 
5. Get random winner clicking Set winners button (balance is updated automatically)
6. You can click Check balance button against each player to check his balance only.
7. You can revert all the changes clicking RESET DB button