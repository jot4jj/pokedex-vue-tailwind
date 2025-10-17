import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PokemonList from '@/components/organisms/PokemonList.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/Pokedex', component: PokemonList},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router