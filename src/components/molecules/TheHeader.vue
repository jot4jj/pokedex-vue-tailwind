<template>
    <div class="flex h-20 bg-gray-800 justify-around items-center border-b-gray-50">
        <RouterLink to="/">
            <img src="../../assets/img/logo.png" alt="logo" class="w-24 xl:w-48">
        </RouterLink>
        <ul class="text-xl gap-8 hidden md:flex text-gray-200">
            <li>
                <RouterLink to="/">Início</RouterLink>
            </li>
            <li>
                <RouterLink to="/Pokedex">Pokédex</RouterLink>
            </li>
        </ul>

        <button @click="menuAberto = !menuAberto" class="sm:flex md:hidden text-3xl text-white border-l-0">
            &#9776
        </button>

        <Transition name="fade">
            <ul v-show="menuAberto" class="flex flex-col absolute h-full w-1/3 top-20 bg-gray-800 right-0 p-4 gap-3 text-center text-white">
            <li>
                <RouterLink to="/">Home</RouterLink>
            </li>
            <li>
                <RouterLink to="/Pokedex">Pokédex</RouterLink>
            </li>
        </ul>
        </Transition>

    </div>
</template>

<script>
import { Transition } from 'vue';


export default {
    name: 'TheHeader',
    data () {
        return {
            menuAberto: false
        }
    }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>