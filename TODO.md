# TODO

## Backend

- Make the cloud functions work
- make admin section

## UI

- Think of the logic to make UI skins

## Player

- continue creating wallet functions
- fetch schools from places API

## Session

- Think of a way to pass player data between components (maybe context, idk)

## Quests

- How does the user submit the quest?

  - Ask the user perms to upload a file that proves that the quest was really done and changes the status to "done" (not sure how the logic will be for the verification to be done, if the file that proves it is false the file is removed and the Quest reverts to "in progress" status)
  - If the user does not give perms to access the files use the geo-location of the user to see if the location of the user matches the location of the quest
  - If the user didn't do the quest simply show something in the UI that demonstrates

- Logic to increase the quest frequency (?)
- Attach quests to users & deprecate questsDone array in players data

## Rewards

- random title 5, 10, 25 lvl, last should have a 2x multiplier
- at 10 lvl: 1€, 2€ & 5€ -> carteira e dps o user escolhe o montante para gerar qr em pdf

## Battle Pass

- make sure battle pass can't be leveled up when it's at last level
