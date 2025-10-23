<template>
    <div>
        <input
            type="text" 
            placeholder="Buscar Pokémon"
            class="w-[80vw] md:w-[40vw] placeholder:text-gray-700 p-2 rounded-lg bg-gray-300 text-gray-900"
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