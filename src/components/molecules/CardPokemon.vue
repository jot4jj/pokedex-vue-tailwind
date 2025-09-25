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
            @keyup="buscarPokemonNome(searchTerm)"
            class="m-4 p-2 rounded-lg w-2/3 xl:w-full"
          />
        </div>

        <div>
          <select
            name="filtroTipo"
            class="p-2"
            v-model="selectedType"
            @change="filtrarPorTipo(selectedType)"
          >
            <option value="">Todos os tipos</option>
            <option 
              v-for="type in tipos" 
              :value="type"
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </option>
          </select>

          <select
            name="filtroGeracao"
            class="p-2"
            v-model="selectedGeneration"
            @change="filtrarPorGeracao(selectedGeneration)"
          >
            <option value="">Todas as gerações</option>
            <option 
              v-for="geracao in geracoes" 
              :value="geracao"
            > 
              Geração{{ geracao }}
            </option>
          </select>

        </div>
      </div>

      <div
        class="grid grid-cols-1 place-items-center gap-12 mt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-24 xl:hover:transition"
      >
        <div v-if="searchResult" class="flex flex-col w-2/3">
          <img
            :src="searchResult.sprites.other['official-artwork'].front_default"
            :alt="searchResult.name"
          />
          <div>
            <p class="text-gray-600 text-xl xl:text-lg">
              Nº{{ String(searchResult.id).padStart(4, "0") }}
            </p>
            <p class="text-gray-950 text-3xl pb-2 xl:text-2xl">
              {{
                searchResult.name.charAt(0).toUpperCase() +
                searchResult.name.slice(1)
              }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <img
              v-for="(icon, idx) in searchResult.typeIcons"
              :src="icon"
              :key="idx"
              class="rounded-lg"
            />
          </div>
        </div>

        <div
          v-for="poke in buscarPokemon"
          :key="poke.id"
          class="flex flex-col w-2/3"
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
              {{ poke.name.charAt(0).toUpperCase() + poke.name.slice(1) }}
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
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, computed, watch } from "vue";

const pokemon = ref([]);
const searchTerm = ref("");
const searchResult = ref(null);
const erro = ref(null);
const loading = ref(true);

async function fetchPokemon() {
  try {
    const listRes = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=12`);
    const results = listRes.data.results;
    const promises = results.map((p) => axios.get(p.url));
    const details = await Promise.all(promises);

    pokemon.value = details.map((d) => d.data);

    for (const p of pokemon.value) {
      p.typeName = p.types.map((t) => t.type.name);

      const typeIconsPromises = p.types.map(async (t) => {
        const typeRes = await axios.get(t.type.url);
        return typeRes.data.sprites["generation-viii"]["sword-shield"].name_icon;
      });

      p.typeIcons = await Promise.all(typeIconsPromises);
    }
  } catch (erro) {
    erro.value = "Erro ao buscar Pokemon.";
    console.error(erro);
  } finally {
    loading.value = false
  }
}

const buscarPokemon = computed(() => {
  if (!searchTerm.value) return pokemon.value;
  return pokemon.value.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

async function buscarPokemonNome(nome) {
  try {
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`
    );
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

watch(searchTerm, (novoValor) => {
  if (!novoValor) {
    searchResult.value = null;
    erro.value = null;
  }
});

const selectedType = ref("");
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

async function filtrarPorTipo(tipo) {
  if (!tipo) return fetchPokemon();

  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/type/${tipo}`);
    const lista = res.data.pokemon;

    const promises = lista.map((p) => axios.get(p.pokemon.url));

    const details = await Promise.all(promises);

    pokemon.value = details.map((d) => d.data);

    for (const p of pokemon.value) {
      p.typeName = p.types.map((t) => t.type.name);

      const typeIconsPromises = p.types.map(async (t) => {
        const typeRes = await axios.get(t.type.url);
        return typeRes.data.sprites["generation-viii"]["sword-shield"].name_icon;
      });

      p.typeIcons = await Promise.all(typeIconsPromises);
    }

  } catch (err) {
    console.error(err);
  }
}
const selectedGeneration = ref('')
const geracoes = [1, 2, 3, 4, 5, 6, 7, 8 ,9]

async function filtrarPorGeracao(geracao) {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/generation/${geracao}`)

    const listaDeSpecies = res.data.pokemon_species

    const promises = listaDeSpecies.map( s =>  axios.get(`https://pokeapi.co/api/v2/pokemon/${s.name}`))

    const details = await Promise.all(promises)

    pokemon.value = details.map(d => d.data)

    for (const p of pokemon.value) {
      p.typeName = p.types.map((t) => t.type.name);

      const typeIconsPromises = p.types.map(async (t) => {
        const typeRes = await axios.get(t.type.url);
        return typeRes.data.sprites["generation-viii"]["sword-shield"].name_icon;
      });

      p.typeIcons = await Promise.all(typeIconsPromises);
    }

  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchPokemon);
</script>

<style scoped>
@import url("../../index.css");
</style>
