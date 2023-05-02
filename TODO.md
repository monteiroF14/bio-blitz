# TODO

## Backend

- Get the locations from the maps if it's free and add to the db, run the code only once and see if you can put the schools too
- Make the cloud functions work

## UI

- Think of the logic to make UI skins

## Player

- Every 10 levels generate new theme & add to UI for user to edit
- Make the code for the player to give feedback
- Create the mutations to update the player's data in the DB

## Quests

- How does the user submit the quest?

  - Ask the user perms to upload a file that proves that the quest was really done and changes the status to "done" (not sure how the logic will be for the verification to be done, if the file that proves it is false the file is removed and the Quest reverts to "in progress" status)
  - If the user does not give perms to access the files use the geo-location of the user to see if the location of the user matches the location of the quest
  - If the user didn't do the quest simply show something in the UI that demonstrates

- Logic to increase the quest frequency (?)

## Battle Pass

- Add the code for each lvl rewards aka skins for the app (background, avatar border, font) & X€ tickets for the bar/canteen/etc
