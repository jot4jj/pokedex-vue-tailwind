<template>
  <div
    class="grid grid-cols-1 h-[calc(100vh_-_5rem)] place-items-center 2xl:grid-cols-2 p-4 bg-gradient-to-t from-white to-red-700"
  >
    <div class="flex flex-col gap-4 text-center 2xl:text-left 2xl:w-3/4 order-2 2xl:order1">

        <p class="text-3xl font-normal tracking-widest xl:text-4xl">
          <span class="font-bold">Find </span>
          <span class="text-gray-100 font-normal">all your favorite </span>
          <span class="font-bold">Pokemon</span>
        </p>

        <p class="font-normal w-screen sm:text-2xl 2xl:w-full">
          You can know the type of Pokemon, its strengths, disadvantages and
          abilities
        </p>

        <RouterLink to="/Pokedex">
          <button class="p-4 text-xl w-3/4 rounded-xl 2xl:w-full bg-red-600 border-red-700 active:bg-red-700 active:border-red-800 text-gray-200">
            Ver Pokémon
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

  </div>
</template>

<style scoped>
@import url("../index.css");

.font-bold {
  font-family: flexo-bold;
}

.font-normal {
  font-family: flexo-regular;
}
</style>
