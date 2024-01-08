<!-- 
  FILENAME: GameInstructions.vue
  DESCRIPTION: The component renders a container on top of the game container. Displays sets of instructions to user for each game step.
  AUTHOR: Annija Karitone 
-->
<template>
  <div v-if="status !== gameStatusType.GameEnded" class="instructions text-center">
    <div>
      <div v-if="status === gameStatusType.Prepare">
        <h2>Welcome to battleship game!</h2>
        <p>Objective: Sink all your opponent's ships before they sink yours!</p>
        <p>
          Let's prepare - Place all your ships on the grid (hold, drag and release) and then select
          an opponent.
        </p>
      </div>
      <div v-if="status === gameStatusType.Waiting">
        <h2>Waiting in the battlefield...</h2>
        <p v-if="!isOpponentConnected">Please wait for the opponent to join the battle.</p>
        <p v-else>
          Please wait for the opponent to join the battle or modify ship placement declaring 'Not
          Ready'.
        </p>
      </div>
      <div v-if="status === gameStatusType.WaitingActive">
        <h2>{{ isOpponentConnected ? 'Prepare for the battle' : 'Declare a battle' }}</h2>
        <p v-if="!isOpponentConnected">Share this link with your friend.</p>
        <span class="instructions__link" v-if="!isOpponentConnected">
          <input v-model="generateFriendLink" readonly />
          <img
            v-if="!isLinkCopied"
            class="instructions__link-copy"
            alt="Copy"
            src="@/assets/icons/copy.svg"
            height="20"
            v-clipboard:copy="generateFriendLink"
            v-clipboard:success="onSuccessCopy"
          />
          <img v-else alt="Copied" src="@/assets/icons/copied.svg" height="20" />
        </span>
        <p v-if="isOpponentConnected">
          Please modify your ship placement and hit 'Ready' when ships are in their positions for
          the battle!
        </p>
      </div>
      <div v-if="status === gameStatusType.Game">
        <div class="instructions__users">
          <user-data-widget
            :rank="user ? user.rank : null"
            :username="userPlayer ? userPlayer.username : 'Unknown'"
            :is-user="user ? true : false"
            text="You"
          />
          <user-data-widget
            :rank="opponent ? opponent.rank : null"
            :username="opponentPlayer ? opponentPlayer.username : 'Unknown'"
            :is-user="opponent ? true : false"
            text="Opponent"
          />
        </div>

        <div>
          <p v-show="isPlayerTurn">Your turn!</p>
          <p v-show="isPlayerTurn">Select a cell on attack grid to launch a missile.</p>
          <p v-show="!isPlayerTurn">Opponent's turn.</p>
          <p v-show="!isPlayerTurn">Get ready for impact!</p>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { GameStatus, type Player } from '@/types/GameTypes'
import UserDataWidget from '@/components/widgets/UserDataWidget.vue'
import type { User } from '@/types/User'

export default defineComponent({
  components: {
    UserDataWidget
  },
  props: {
    status: {
      type: Number as PropType<GameStatus>,
      required: true
    },
    friendGameSessionId: {
      type: String as PropType<string | null>,
      default: null
    },
    isPlayerTurn: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    isOpponentConnected: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    user: {
      type: Object as PropType<User | null>,
      default: null
    },
    userPlayer: {
      type: Object as PropType<Player | null>,
      default: null
    },
    opponent: {
      type: Object as PropType<User | null>,
      default: null
    },
    opponentPlayer: {
      type: Object as PropType<Player | null>,
      default: null
    }
  },
  data() {
    return {
      isLinkCopied: false as boolean,
      gameStatusType: GameStatus
    }
  },
  computed: {
    generateFriendLink(): string {
      if (!this.friendGameSessionId) {
        return ''
      }
      return `${window.location.host}${window.location.pathname}?id=${this.friendGameSessionId}`
    }
  },
  methods: {
    onSuccessCopy() {
      this.isLinkCopied = true
      setTimeout(() => {
        this.isLinkCopied = false
      }, 1500)
    }
  }
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/_variables';
.instructions {
  background-color: #adc3cc4d;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;

  &__link {
    position: relative;
    height: 30px;

    input {
      max-width: 300px;
      width: 100%;
      height: 100%;
      padding: 5px;
      background: $cl-bg-card;
      font-size: 16px;
      border: none;
      color: $cl-text;
      border-radius: 5px;

      &:focus {
        outline: none;
        border: none;
      }
    }

    img {
      position: absolute;
      top: 2px;
      right: 5px;
      cursor: pointer;
    }
  }

  &__users {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}

html[data-theme='light'] {
  .instructions__link-copy {
    filter: invert(100%);
  }
}

@media only screen and (max-width: 600px) {
  .instructions {
    margin-bottom: 5px;
  }
}
</style>
