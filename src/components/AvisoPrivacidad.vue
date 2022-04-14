<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar dark color="teal" max-height="80px">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title class="text-h4">Politicas de privacidad</v-toolbar-title>
          </v-toolbar>
          <v-card-title class="text-center text-h5"> Leer con atención </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
            consequuntur, ipsa, ut atque voluptas voluptatem optio, reiciendis
            similique qui facilis repellat eius nulla. Unde illo dolores id
            ipsam, veritatis facilis.

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              consequuntur, ipsa, ut atque voluptas voluptatem optio, reiciendis
              similique qui facilis repellat eius nulla. Unde illo dolores id
              ipsam, veritatis facilis.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              consequuntur, ipsa, ut atque voluptas voluptatem optio, reiciendis
              similique qui facilis repellat eius nulla. Unde illo dolores id
              ipsam, veritatis facilis.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              consequuntur, ipsa, ut atque voluptas voluptatem optio, reiciendis
              similique qui facilis repellat eius nulla. Unde illo dolores id
              ipsam, veritatis facilis.
            </p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "AvisoPrivacidadComponent",
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
    };
  },
};
</script>