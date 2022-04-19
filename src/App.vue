<template>
  <v-app>
    <v-main>
      <menu-component></menu-component>
      <footer-component></footer-component>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import FooterComponent from "../src/components/Footer";
import MenuComponent from "../src/components/Menu";

export default {
  name: "App",
  components: {
    MenuComponent,
    FooterComponent,
  },
};
</script>
