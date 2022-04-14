<template>
  <v-container>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-btn icon color="error" @click="salir">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="grey lighten-4" class="pa-4">
        <v-avatar class="mb-4" color="red darken-1" size="45">
          <span class="white--text text-h5">{{ abrevsUser }}</span></v-avatar
        >
        <div>Bienvenido {{ usr.nombre_completo }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <!-- menú -->
      <v-list dense nav>
        <router-link v-for="link in links" :key="link.icon" link :to="link.to">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ link.name }}</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import { logout } from "@/providers/auth.js";

export default {
  name: "MenuComponent",
  data: () => ({
    abrevsUser: null,
    usr: null,
    drawer: null,
    links: [
      {
        icon: "mdi-account",
        to: "miperfil",
        name: "Mi perfil",
      },
      {
        icon: "mdi-inbox-arrow-down",
        to: "categorias",
        name: "Categorias",
      },
      {
        icon: "mdi-plus",
        to: "productos",
        name: "Productos",
      },
      {
        icon: "mdi-send",
        to: "inicio",
        name: "Inicio",
        id: 151,
      },
    ],
  }),
  methods: {
    salir() {
      Swal.fire({
        icon: "info",
        title: "Hasta luego ",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      setTimeout(() => {
        logout();
        this.$router.go();
      }, 1000);
    },
  },
  created() {
    this.usr = JSON.parse(localStorage.getItem("user"));
    this.abrevsUser = this.usr.nombre_completo.substr(0, 2).toUpperCase();
  },
};
</script>