<!-- 
  FILENAME: ReplayContainer.vue
  DESCRIPTION: The component renders a game replay.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="replay">
    <button class="replay__close btn-red" @click="$emit('closeReplay')">Return</button>
    <div class="replay__information">
      <user-data-widget
        v-for="player of game.userData"
        :key="player.user.username"
        :rank="player.rank"
        :username="player.user.username"
        :is-user="true && !player.user.deletedAt"
        :text="player.userId === game.GameUser.userId ? 'You' : 'Opponent'"
      >
        <span v-if="player.points"> Points: {{ player.points }}</span>
        <span v-if="game.winnerId && game.winnerId === player.userId"> (Winner) </span>
      </user-data-widget>
      <user-data-widget
        v-if="game.userData.length < 2"
        :username="game.gameType === 'computer' ? 'Friendly AI' : 'Guest'"
        :is-user="false"
        text="Opponent"
      >
        <span v-if="!game.winner || !game.winner.username"> (Winner) </span>
      </user-data-widget>
    </div>
    <div class="replay__progress">
      <img v-if="!replayInProgress" alt="Play" src="@/assets/icons/play.svg" @click="handlePlay" />
      <img
        v-if="replayInProgress"
        alt="Pause"
        src="@/assets/icons/pause.svg"
        @click="handlePause"
      />
      <div class="replay__slider">
        <input
          ref="progress"
          type="range"
          min="0"
          :max="sortedGridGroups.length"
          v-model="progressIndex"
          @input="handleProgressChange"
        />
      </div>
    </div>
    <div class="replay__gameboards">
      <game-board
        v-if="gameboard"
        :gameboard="gameboard"
        :is-player-game-board="true"
        :is-replay-mode="true"
      />
      <game-board
        v-if="attackGameboard"
        :gameboard="attackGameboard"
        :is-player-game-board="false"
        :is-replay-mode="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameBoard from '../game/GameBoard.vue'
import UserDataWidget from '../widgets/UserDataWidget.vue'
import type { GameboardCell, Gameboard as GameBoardType } from '@/types/GameTypes'
import type { PropType } from 'vue'

export default defineComponent({
  components: { GameBoard, UserDataWidget },
  props: {
    game: {
      type: Object as PropType<any>,
      required: true
    }
  },
  data() {
    return {
      gameboard: null as GameBoardType | null,
      attackGameboard: null as GameBoardType | null,
      sortedGridGroups: [] as GameboardCell[][],
      replayInProgress: false as boolean,
      progressIndex: 0 as number,
      replayInterval: null as ReturnType<typeof setInterval> | null
    }
  },
  mounted() {
    this.cleanGameboards()
    this.groupCellsByUpdatedAt()
  },
  watch: {
    progressIndex: {
      handler(val) {
        const slider: any = this.$refs.progress
        if (slider) {
          const min = slider.min
          const max = slider.max

          slider.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%'
        }

        if (val === this.sortedGridGroups.length) {
          this.replayInProgress = false
          if (this.replayInterval) {
            clearInterval(this.replayInterval)
          }
        }
      },
      deep: true
    }
  },
  methods: {
    handlePlay() {
      if (this.progressIndex === this.sortedGridGroups.length) {
        this.progressIndex = 0
      }

      if (this.progressIndex === 0) {
        const { gameboard, attackGameboard } = this.game.GameUser
        this.gameboard = this.cleanGameboardGrid(gameboard)
        this.attackGameboard = this.cleanGameboardGrid(attackGameboard)
      }

      this.replayInProgress = true
      if (this.sortedGridGroups) {
        this.revealCellsWithDelay()
      }
    },
    handlePause() {
      this.replayInProgress = false
      if (this.replayInterval) {
        clearInterval(this.replayInterval)
        this.replayInterval = null
      }
    },
    handleProgressChange() {
      const { gameboard, attackGameboard } = this.game.GameUser

      this.gameboard = this.cleanGameboardGrid(gameboard)
      this.attackGameboard = this.cleanGameboardGrid(attackGameboard)

      if (this.replayInProgress && this.replayInterval) {
        clearInterval(this.replayInterval)
      }

      this.revealCells()

      if (this.replayInProgress) {
        this.revealCellsWithDelay()
      }
    },
    cleanGameboards() {
      const { gameboard, attackGameboard } = this.game.GameUser

      this.gameboard = this.cleanGameboardGrid(gameboard)
      this.attackGameboard = this.cleanGameboardGrid(attackGameboard)
    },
    cleanGameboardGrid(gameboard: GameBoardType): GameBoardType {
      const gameboardCopy: GameBoardType = JSON.parse(JSON.stringify(gameboard))
      gameboardCopy.grid = gameboardCopy.grid.map((row: GameboardCell[]) =>
        row.map((cell: GameboardCell) => ({
          ...cell,
          state: cell.state === 'ship' || cell.state === 'hit' ? 'ship' : 'empty'
        }))
      )
      return gameboardCopy
    },
    revealCellsWithDelay() {
      if (!this.sortedGridGroups) return
      this.replayInterval = setInterval(() => {
        if (this.progressIndex <= this.sortedGridGroups.length) {
          this.progressIndex++
          this.revealCells()
        }
      }, 1000)
    },
    revealCells() {
      let index = 0
      while (index < this.progressIndex) {
        const groupToUpdate = this.sortedGridGroups[index]
        groupToUpdate.forEach((cellToUpdate: GameboardCell) => {
          const { row, col, origin, state } = this.findCellPosition(cellToUpdate)
          if (state === 'hit' || state === 'miss') {
            const gameboard: GameBoardType | null =
              origin === 'player' ? this.gameboard : this.attackGameboard
            if (row !== -1 && col !== -1 && gameboard) {
              gameboard.grid[row][col].state = state
            }
          }
        })
        index++
      }
    },
    findCellPosition(cellToUpdate: GameboardCell) {
      const gameboard: GameBoardType | null =
        cellToUpdate.origin === 'player' ? this.gameboard : this.attackGameboard
      if (gameboard) {
        for (let i = 0; i < gameboard.grid.length; i++) {
          const col: number = gameboard.grid[i].findIndex(
            (cell) => cell.gameboardCellId === cellToUpdate.gameboardCellId
          )
          if (col !== -1) {
            return { row: i, col, origin: cellToUpdate.origin, state: cellToUpdate.state }
          }
        }
      }
      return { row: -1, col: -1 }
    },
    groupCellsByUpdatedAt() {
      const { gameboard, attackGameboard } = this.game.GameUser

      const mergedGrid: GameboardCell[] = [
        ...gameboard.grid.flatMap((row: GameboardCell[]) =>
          row.map((cell: GameboardCell) => ({ ...cell, origin: 'player' }))
        ),
        ...attackGameboard.grid.flatMap((row: GameboardCell[]) =>
          row.map((cell: GameboardCell) => ({ ...cell, origin: 'attack' }))
        )
      ]

      const cellGroups: GameboardCell[][] = []
      const seenUpdatedAt: Set<string> = new Set()

      mergedGrid.forEach((cell: GameboardCell) => {
        if (!seenUpdatedAt.has(cell.updatedAt)) {
          const group = mergedGrid.filter(
            (c) => c.updatedAt === cell.updatedAt && (c.state === 'hit' || c.state === 'miss')
          )
          if (group && group.length) {
            cellGroups.push(group)
          }
          seenUpdatedAt.add(cell.updatedAt)
        }
      })

      if (cellGroups && cellGroups.length) {
        cellGroups.sort((a: any[], b: any[]) => a[0].updatedAt - b[0].updatedAt)
      }

      this.sortedGridGroups = cellGroups
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/_variables';
.replay {
  border: solid 1px $cl-brdr-game;
  padding: 10px;
  border-radius: 5px;

  &__information {
    display: flex;
    justify-content: space-between;
    background-color: #adc3cc4d;
    border-radius: 5px;
    padding: 10px 20px;
    margin-top: 5px;
  }

  &__gameboards {
    padding: 0 20px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: space-around;

    :deep(.ship) {
      border: dashed 1.5px $cl-text;
      box-shadow: none;
      z-index: 10;
    }
  }

  &__close {
    margin-left: auto;
    margin-right: 10px;
    display: block;
  }

  &__slider {
    flex-grow: 1;
  }

  &__progress {
    width: 100%;
    display: flex;
    align-items: center;

    img {
      width: 17px;
      height: 17px;
      cursor: pointer;
    }

    input[type='range'] {
      width: 100%;
      appearance: none;
      accent-color: $cl-secondary;
      height: 10px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 5px;
      background-image: linear-gradient($cl-secondary, $cl-secondary);
      background-size: 0% 100%;
      background-repeat: no-repeat;

      &::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: $cl-secondary;
        cursor: ew-resize;
      }

      &::-webkit-slider-runnable-track {
        appearance: none;
        box-shadow: none;
        border: none;
        background: transparent;
      }
    }
  }
}

@media only screen and (max-width: 600px) {
  .replay {
    &__information {
      padding: 5px 10px;
    }

    &__gameboards {
      gap: 0;
    }
  }
}
</style>
