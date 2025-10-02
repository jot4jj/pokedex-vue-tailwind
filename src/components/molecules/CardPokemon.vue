<template>
  <div>
    <div v-if="loading" class="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <img src="../../assets/img/pikachu.gif" alt="Carregando" />
    </div>

    <div v-else-if="erro">{{ erro }}</div>

    <div v-else class="flex flex-col min-h-screen flex-grow">
      <div class="flex flex-col gap-4 place-items-center w-full justify-evenly md:flex-row">

        <div>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Buscar Pokémon"
            class="bg-gray-300 text-gray-900 placeholder:text-gray-700 w-full m-4 p-2 rounded-lg"
          />
        </div>

        <div class="flex gap-12">
          <select 
            name="filtroTipo" 
            class="p-2 bg-gray-300 text-gray-700 rounded-lg" 
            v-model="selectedType"
          >
            <option value="">Selecione o tipo</option>
            <option 
              v-for="type in tipos" 
              :value="type" 
              class="text-gray-900"
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </option>
          </select>

          <select
            name="filtroGeracao"
            class="p-2 bg-gray-300 text-gray-700 rounded-lg"
            v-model.number="selectedGeneration"
          >
            <option value="">Selecione a geração</option>
            <option 
              v-for="geracao in geracoes" 
              :value="geracao"
              class="text-gray-900"
            >
              Geração {{ geracao }}
            </option>
          </select>
        </div> 
      </div>

      <div class="grid place-items-center m-16">
        <div class="grid gap-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

          <div
            v-for="poke in buscarPokemon"
            :key="poke.id"
            class="flex flex-col gap-2 sm:p-4 md:p-8 xl:p-12 rounded-xl "
          >
            <div>
                <img
                  :src="poke.sprites.other['official-artwork'].front_default"
                  :alt="poke.name"
                  class="rounded-l-xl p-2"
                />
            </div>

            <div class="text-left tracking-wide">

              <p class="text-gray-600 text-lg sm:text-lg lg:text-lg ">
                Nº{{ String(poke.id).padStart(4, "0") }}
              </p>

              <p class="text-gray-950 text-2xl pb-2 xl:text-2xl">
                {{ capitalize(poke.name) }}
              </p>

              <div class="grid grid-cols-2 w-3/4 sm:w-full gap-2 place-items-center">
                <img
                  v-for="(icon, idx) in poke.typeIcons"
                  :key="idx"
                  :src="icon"
                  :alt="poke.typeName"
                  class="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, computed, capitalize, watch } from "vue";

const todosPokemon = ref([]);
const searchTerm = ref("");
const searchResult = ref(null);
const selectedGeneration = ref("");
const selectedType = ref("");
const erro = ref(null);
const loading = ref(true);

const tipos = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const geracoes = [1, 2, 3, 4, 5, 6, 7, 8, 9];

async function fetchPokemon(gen) {
  try {
    const listRes = await axios.get(`https://pokeapi.co/api/v2/generation/${gen}`);
    const species = listRes.data.pokemon_species

    const promises = species.map( async (pokeS) => {
      const id = pokeS.url.split('/').filter(Boolean).pop()
      const pokeRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      const p = pokeRes.data
      p.typeName = p.types.map((t) => t.type.name)

      const typeIconsPromises = p.types.map(async (t) => {
        const typeRes = await axios.get(t.type.url);
        return typeRes.data.sprites["generation-viii"]["sword-shield"].name_icon;
      });

      p.typeIcons = await Promise.all(typeIconsPromises)

      return p
    })

    todosPokemon.value = await Promise.all(promises)

  } catch (erro) {
    erro.value = "Erro ao buscar Pokemon.";
    console.error(erro);
  } finally {
    loading.value = false;
  }
}

const buscarPokemon = computed(() => {

  if (searchResult.value) {
    return [searchResult.value];
  }

  let lista = todosPokemon.value;

  if (selectedGeneration.value) {
    const ranges = {
      1: [1, 151],
      2: [152, 251],
      3: [252, 386],
      4: [387, 493],
      5: [494, 649],
      6: [650, 721],
      7: [722, 809],
      8: [810, 905],
      9: [906, 1010],
    };
    const [min, max] = ranges[selectedGeneration.value];
    lista = lista.filter((p) => p.id >= min && p.id <= max);

    if (selectedType.value) {
      lista = lista.filter((p) => p.typeName.includes(selectedType.value));
    }

  }

  return lista;
});

async function buscarPokemonNome(nome) {

  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${String(nome).toLowerCase()}`);
    const p = res.data;

    const typeIconsPromises = p.types.map(async (t) => {
      const typeRes = await axios.get(t.type.url);
      return typeRes.data.sprites["generation-viii"]["sword-shield"].name_icon;
    });

    p.typeIcons = await Promise.all(typeIconsPromises);

    searchResult.value = p;
    erro.value = null;

  } catch (err) {
    searchResult.value = null;
    console.error(err);
  }
}

watch(selectedGeneration, async (nova) => {
  if (!nova) {
    await fetchPokemon(1)
  } else {
    await fetchPokemon(nova)
  }
})

watch(searchTerm, (novoValor) => {
  if (!novoValor) {
    searchResult.value = null;
    erro.value = null;
  } else {
    buscarPokemonNome(novoValor)
  }
});

onMounted(() => fetchPokemon(1));
</script>

<style scoped>
@import url("../../index.css");
</style>