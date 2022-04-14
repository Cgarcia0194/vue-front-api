<template>
  <v-card flat>
    <v-card-text>
      <v-text-field
        v-model="txtCorreo"
        label="Usuario"
        prepend-icon="mdi-account-circle"
        outlined
      ></v-text-field>
      <v-text-field
        label="Contraseña actual"
        v-model="txtContrasenia"
        :type="showPss ? 'text' : 'password'"
        prepend-icon="mdi-lock"
        :append-icon="showPss ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword()"
        outlined
      ></v-text-field>
      <v-text-field
        label="Nueva contraseña"
        v-model="txtContrasenia"
        :type="showPss ? 'text' : 'password'"
        prepend-icon="mdi-key"
        :append-icon="showPss ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword()"
        outlined
      ></v-text-field>
      <v-text-field
        label="Confirmación nueva contraseña"
        v-model="txtContrasenia"
        :type="showPss ? 'text' : 'password'"
        prepend-icon="mdi-key"
        :append-icon="showPss ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword()"
        outlined
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        class="ma-2"
        outlined
        color="primary"
        :disabled="validar"
        @click="modificarCategoria"
      >
        Modificar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "MiPerfilInicioComponent",
};
</script>