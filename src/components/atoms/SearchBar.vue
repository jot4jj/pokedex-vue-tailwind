<template>
    <div>
        <input
            type="text" 
            placeholder="Buscar Pokémon"
            class="bg-gray-300 text-gray-900 placeholder:text-gray-700 w-full m-4 p-2 rounded-lg"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: String,
})
</script>