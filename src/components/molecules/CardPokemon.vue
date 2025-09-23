<template>
    <div>
        <div 
        v-if="loading" 
        class="flex place-items-center w-2/5"
        >
            <img
            src="../../assets/img/pikachu.gif" 
            alt="carregando"
            >
        </div>

        <div v-else-if="erro"> {{ erro }} </div>
        <div
        v-else 
        class="grid grid-cols-1 place-items-center gap-12 mt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-24 xl:hover:transition"
        >
            <div
            v-for="poke in pokemon" 
            :key="poke.id" 
            class="flex flex-col w-2/3"
            >   
                <img
                :src="poke.sprites.other['official-artwork'].front_default"
                :alt="poke.name"
                />
                
                <div 
                class="text-left p-4 tracking-wide"
                >

                    <p class="text-gray-600 text-xl xl:text-lg">
                    Nº {{ String(poke.id).padStart(4, '0') }}
                    </p>

                    <p class="text-gray-950 text-3xl pb-2 xl:text-2xl">
                    {{ poke.name.charAt(0).toUpperCase() + poke.name.slice(1) }}
                    </p>

                    <div 
                    class="grid grid-cols-2 gap-2"
                    >
                        <img
                        v-for="(icon, idx) in poke.typeIcons" 
                        :key="idx"
                        :src="icon" 
                        :alt="poke.typeName" 
                        id="icon"
                        class="rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div 
        v-if="loading === false" 
        class="flex items-center justify-center"
        >
            <button 
            @click="carregarMais"
            class=" w-full text-xl m-8 p-4 rounded-2xl bg-green-400 active:bg-green-500 lg:w-1/2 xl:w-1/3"
            >
                Carregar mais Pokémon
            </button>
        </div>
    </div> 
</template>

<script setup>   

import axios from 'axios';
import { ref, onMounted } from 'vue';

const pokemon = ref([])
const erro = ref(null)
const loading = ref(true)
const offset = ref(0)
const limit = 12

async function buscarPokemon() {
    try{
        const listRes = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset.value}`)
        const results = listRes.data.results

        const promises = results.map( p => axios.get(p.url))

        const details = await Promise.all(promises)

        const newPokemon = details.map( d => d.data)

        pokemon.value.push(...newPokemon)

        for (const p of pokemon.value){
            p.typeName = p.types.map(t => t.type.name)


            const typeIconsPromises = p.types.map( async (t) => {
                const typeRes = await axios.get(t.type.url)
                return typeRes.data.sprites['generation-viii']["sword-shield"].name_icon
            })

            p.typeIcons = await Promise.all(typeIconsPromises)
        }

    } catch (erro) {
        erro.value = "Erro ao buscar Pokemon."
        console.error(erro)
    } finally {
        loading.value = false
    }
}

function carregarMais () {
    offset.value += limit
    buscarPokemon()
}

onMounted(buscarPokemon)

</script>

<style scoped>
@import url('../../index.css');
</style>