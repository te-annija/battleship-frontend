<!-- 
  FILENAME: RulesPage.vue
  DESCRIPTION: The component serves as the main container for game rules page in the route '/rules'.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="rules container">
    <div class="card box-shadow">
      <h1>Rules of battleship</h1>
      <h3>Objective</h3>
      <p>
        Battleship is a strategic, turn-based game designed for 2 players. The objective is to sink
        all of your opponent's ships before they sink yours.
      </p>
      <h3>Setup</h3>
      <p>
        You're in charge of two 10x10 grids: one for placing your ships and one for launching your
        shots.
      </p>
      <p>
        Before play starts, it's your task to secretly position your ships on your primary grid.
        Remember, ships can't overlap or sit adjacent to each other. To place a ship, simply drag it
        from the ship container to a grid cell and drop it or opt for random placement. You can
        rotate the ship before placing it on the grid in the ship container by pressing the rotate
        button.
      </p>
      <h3>Game modes</h3>
      <p>Once all ships are in place, the choice is yours.</p>
      <ul>
        <li>
          Play online: Challenge a randomly selected opponent online, earn points and aim for a spot
          on the leaderboard.
        </li>
        <li>Play against computer: Test your skills against the computer AI.</li>
        <li>
          Play against friend: Invite a friend using a shareable link to play against each other.
        </li>
      </ul>
      <h3>Gameplay</h3>
      <p>
        Take turns aiming at your opponent's grid to dismantle their fleet. When you hit, the cell
        is marked with a cross; misses get a dot. A successful hit grants you another turn. Ensure
        attacks are made within 90 seconds; failure to do so will result in a lost game.
      </p>
      <h3>End of game</h3>
      <p>
        Sink every last ship in your opponent's fleet to claim victory. Additionally, failing to
        attack within 90 seconds or leaving the battlefield early will result in your loss.
      </p>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import '../assets/styles/_variables';

.rules {
  h1 {
    text-align: left;
    text-transform: uppercase;
    font-size: 25px;
    margin-bottom: 10px;
  }

  h3 {
    font-weight: bold;
    font-size: 17px;
    text-transform: uppercase;
    margin-top: 15px;
  }

  p {
    font-size: 16px;
    text-align: justify;
    margin-bottom: 5px;
  }

  ul {
    margin-left: 20px;
  }

  &__accent {
    font-size: 25px !important;

    a:hover {
      color: $cl-deep-blue;
    }
  }
}
</style>
