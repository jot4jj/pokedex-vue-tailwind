<template>
    <div 
        v-if="isOpen"
        class="bg-black bg-opacity-60 w-full h-full grid place-items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        @click="closeModal"
    >
        <div
            class="bg-gray-200 flex"
            @click.stop
        >
            <div>
                <img 
                :src="pokemon.sprites.other['official-artwork'].front_default" 
                :alt="pokemon.name"
                >
            </div>

            <div>
                <p> {{ pokemon.name }}</p>
            </div>

            <div>
                <p>{{ pokemon.id }}</p>
                <p>{{ pokemon.weight }}</p>

                <p 
                    v-for="abilitie in pokemon.abilities"
                    class=""
                >
                    {{ abilitie }}
                </p>

                <p 
                    v-for="stat in pokemon.stats"
                    class=""
                >
                    {{ stat.name }}: {{ stat.base_stat }}
                </p>
            </div>
            
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    isOpen: Boolean,
    pokemon: Object,
    abilities: Array,
    stats: Object
})


const emit = defineEmits(["close"])

function closeModal() {
    emit("close")
}


</script>   