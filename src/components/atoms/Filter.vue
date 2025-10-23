<template>
  <div 
    class="flex flex-col items-center md:flex-row gap-12"
  >
    <select
      name="filtroTipo"
      class="p-2 bg-gray-300 text-gray-700 rounded-lg w-[80vw] md:w-[15vw] lg:w-[20vw]"
      v-model="modelType"
    >
      <option value="">Selecione o tipo</option>
      <option
        v-for="type in tipos"
        :key="type"
        :value="type"
        class="text-gray-900"
      >
        {{ capitalize(type) }}
      </option>
    </select>

    <select
      name="filtroGeracao"
      class="p-2 bg-gray-300 text-gray-700 rounded-lg w-[80vw] md:w-[15vw] lg:w-[20vw]"
      v-model.number="modelGeneration"
    >
      <option value="">Selecione a geração</option>
      <option
        v-for="geracao in geracoes"
        :key="geracao"
        :value="geracao"
        class="text-gray-900"
      >
        Geração {{ geracao }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { capitalize, ref, watch } from "vue";

const props = defineProps({
  modelType: String,
  modelGeneration: [Number, String],
});

const emit = defineEmits(["update:modelType", "update:modelGeneration"]);

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

const modelType = ref(props.modelType);
const modelGeneration = ref(props.modelGeneration);

watch(modelType, (novo) => emit("update:modelType", novo));
watch(modelGeneration, (novo) => emit("update:modelGeneration", novo));
</script>
