# DBot

Main purpose of this bot is to upgrade ranks of Dota 2 players on discord server

# Version 2.5.2

#### Invitation link

Use **` z! help`** to get bot's documentation.  
[Invintation link](https://discord.com/api/oauth2/authorize?client_id=786141154021867521&permissions=201326592&scope=bot)

_!IMPORTANT!_  
Roles in discord appear like waterfall. Server owner is located on top of this waterfall.  
Because of this bot cant change server owner's nickname. To solve this bot uses his own id instead of server owner's.  
For bot to work correctly you must locate bot's role on the top of the rest roles waterfall  
![roles](https://i.imgur.com/mq5d4qG.jpg)

#### If you want to host bot on your own machine

`git clone https://github.com/z164/discord-bot.git`  
`cd discord-bot`  
`npm i`  
Fill up `.env.example` and rename it to `.env`

#### Whats new in v2.0?

Bot used to fetch ranks of immortal players from leaderboards. Now it launches steam and game clients. It now takes more time to update nicknames, but now it can get all ranks in the game. Also this version opens gate for adding more in-game functionality.

![logs](https://user-images.githubusercontent.com/44960007/106314139-5b2add00-627a-11eb-929d-96cdfe6f1c86.png)
