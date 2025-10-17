<template>
  <div
    class="grid grid-cols-1 h-[calc(100vh_-_5rem)] 
    place-items-center 2xl:grid-cols-2 p-4 bg-gradient-to-t
    from-gray-400 to-gray-800"
  >
    <div
      class="flex flex-col gap-8 text-center 2xl:text-left 2xl:w-3/4 order-2 2xl:order1"
    >
      <p class="text-3xl font-normal xl:text-5xl">
        <span class="font-bold">Encontre </span>
        <span class="text-gray-100 font-normal">todos os </span>
        <span class="font-bold">Pokémon</span>
      </p>

      <p class="font-normal w-screen sm:text-2xl 2xl:w-full">
        Você pode saber o tipo do Pokémon, suas habilidades e estatísticas
      </p>

      <RouterLink to="/Pokedex">
        <button
          class="mb-4 p-4 text-xl w-3/4 rounded-xl 2xl:w-full bg-gray-800 text-gray-200"
        >
          Explorar Pokémon
        </button>
      </RouterLink>
    </div>

    <div class="w-full place-items-center order-1 2xl:order-2">
      <img
        src="../assets/img/fundo-homepage.png"
        alt="homepage"
        class="object-contain"
      />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/molecules/Footer.vue';
</script>

<style scoped>
@import url("../index.css");

.font-bold {
  font-family: flexo-bold;
}

.font-normal {
  font-family: flexo-regular;
}
</style>
