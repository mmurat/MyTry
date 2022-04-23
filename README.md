# MyTry

Reach the random number with user plus number and with player random number.

# Install dependencies
yarn

# Build and Deploy the contract

build -> yarn build:release
deploy -> yarn deploy
build & deploy -> yarn dev

# Run the MyTry 

## Create a game

near call $CONTRACT createMyTry '{}' --accountId $CONTRACT // Only Contract owner create game

Return a game goalNumber (to reach it) and a string game id

## Play the game

near call $CONTRACT letsTry '{"id": <game_id>, "plus": <number>}' --accountId <player_account> --amount 0.01
 
amount 0.01 is essential. Every try cost 0.01.   

