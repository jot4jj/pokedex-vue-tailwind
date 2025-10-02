<template>
  <div>
    <div v-if="loading" class="flex place-items-center w-2/5">
      <img src="../../assets/img/pikachu.gif" alt="carregando" />
    </div>

    <div v-else-if="erro">{{ erro }}</div>

    <div v-else class="flex flex-col min-h-screen flex-grow">
      <div class="flex place-items-center justify-evenly">
        <div>

          <input
            type="text"
            v-model="searchTerm"
            placeholder="Buscar Pokémon..."
            class="m-4 p-2 rounded-lg w-2/3 xl:w-full"
          />
        </div>

        <div>
          <select name="filtroTipo" class="p-2" v-model="selectedType">
            <option value="">Selecione o tipo</option>
            <option v-for="type in tipos" :value="type">
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </option>
          </select>

          <select
            name="filtroGeracao"
            class="p-2"
            v-model.number="selectedGeneration"
          >
            <option value="">Selecione a geração</option>
            <option v-for="geracao in geracoes" :value="geracao">
              Geração {{ geracao }}
            </option>
          </select>
        </div> 
      </div>

      <div
        class="grid grid-cols-1 place-items-center gap-12 mt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-24"
      >
        <div class="border-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          <div
            v-for="poke in buscarPokemon"
            :key="poke.id"
            class="flex gap-10"
          >
            <img
              :src="poke.sprites.other['official-artwork'].front_default"
              :alt="poke.name"
            />

            <div class="text-left p-4 tracking-wide">
              <p class="text-gray-600 text-xl xl:text-lg">
                Nº{{ String(poke.id).padStart(4, "0") }}
              </p>

              <p class="text-gray-950 text-3xl pb-2 xl:text-2xl">
                {{ capitalize(poke.name) }}
              </p>

              <div class="grid grid-cols-2 gap-2">
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
