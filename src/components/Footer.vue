<template>
  <v-footer app max-height="50px">
    <p class="d-block text-center w-100">
      © {{ year }}
      Revisa las póliticas de privacidad
      <v-btn icon color="primary" @click="dialog = true">
        <v-icon>mdi-script-text</v-icon>
      </v-btn>
      <v-icon color="green darken-2">mdi-head-eye-outline</v-icon>
    </p>
    <aviso-privacidad :dialog="dialog"></aviso-privacidad>
  </v-footer>
</template>

<script>
import AvisoPrivacidad from "../components/AvisoPrivacidad";
export default {
  name: "FooterComponent",
  components: {
    AvisoPrivacidad,
  },
  data: () => ({
    dialog: false,
    year: new Date().getFullYear(),
  }),
};
</script>

<style scoped>
.w-100 {
  width: 100%;
}
</style>