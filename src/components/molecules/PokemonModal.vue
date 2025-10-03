<template>
  <div
    v-if="isOpen"
    class="bg-black bg-opacity-60 w-full h-full grid place-items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <div class="bg-gray-200 flex flex-col rounded-xl lg:flex-row">
      <div>
        <button @click="closeModal" class="absolute">
          <img src="../../assets/img/close.png" alt="close" class="p-4" />
        </button>
      </div>
      <div class="flex lg:block justify-center">
        <img
          :src="pokemon.sprites.other['official-artwork'].front_default"
          :alt="pokemon.name"
          class="w-1/3 lg:w-full"
        />
      </div>

      <div class="flex flex-col p-4 gap-4 bg-gray-900 text-gray-100">
        <div class="flex gap-4 items-center md:justify-evenly">
          <p class="text-xl sm:text-3xl">
            {{ capitalize(pokemon.name) }}
          </p>

          <div class="flex gap-2 justify-evenly">
            <img
              v-for="icon in pokemon.typeIcons"
              :src="icon"
              class="rounded-lg w-2/5 sm:w-1/2 md:w-full"
            />
          </div>

          <p
            class="p-2 text-xl sm:text-3xl bg-gray-200 text-gray-900 rounded-full"
          >
            {{ pokemon.id }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 p-2 text-center rounded-lg bg-gray-200 text-gray-900"
        >
          <p class="text-sm sm:text-xl">Habilidades</p>

          <div class="flex justify-around w-full gap-2">
            <p v-for="abilitie in pokemon.abilities" class="text-sm sm:text-xl">
              {{ capitalize(abilitie).replaceAll("-", " ") }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-2 gap-2">
          <div v-for="stat in pokemon.stats">
            <div
              class="flex flex-col bg-gray-200 text-gray-900 rounded-lg p-2 items-center"
            >
              <p
                class="text-sm sm:text-xl border-2 border-black text-center w-10 h-10 p-1 rounded-full"
              >
                {{ stat.base_stat }}
              </p>
              <p class="text-sm sm:text-xl">
                {{ capitalize(stat.name) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { capitalize } from "vue";

const props = defineProps({
  isOpen: Boolean,
  pokemon: Object,
  abilities: Array,
  stats: Object,
});

const emit = defineEmits(["close"]);

function closeModal() {
  emit("close");
}
</script>
