<template>
  <v-card class="py-8 px-7" fluid outlined>
    <v-card-text>
      <v-toolbar flat color="teal" dark>
        <v-toolbar-title>Datos de usuario</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical color="teal">
        <v-tab>
          <v-icon left> mdi-account </v-icon>
          Info. personal
        </v-tab>
        <v-tab>
          <v-icon left> mdi-lock </v-icon>
          Credenciales
        </v-tab>

        <!-- Tab info personal -->
        <v-tab-item>
          <MiPerfilDatosComponent />
        </v-tab-item>
        <!-- Tab Inicio sesión -->
        <v-tab-item>
          <MiPerfilInicioComponent> </MiPerfilInicioComponent>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
import { BACK_API } from "../../providers/conn-back";
import { logout, xToken } from "@/providers/auth.js";
import MiPerfilDatosComponent from "./perfil/MiPerfilDatos";
import MiPerfilInicioComponent from "./perfil/MiPerfilInicio";

export default {
  name: "CategoriasPage",
  components: {
    MiPerfilDatosComponent,
    MiPerfilInicioComponent,
  },
  data() {
    return {
      fields: {
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        rfc: "",
        curp: "",
        genero: 0,
        telefono: "",
        telefono_fijo: "",
        fecha_nacimiento: "",
        edad: "",
        correo_electronico: "",
        estado_civil: 0,
        nacionalidad: 0,
        municipio: 0,
      },
      dialog: false,
      route: `${BACK_API}/api/personas`,
    };
  },
  computed: {},
  methods: {},
  created() {},
};
</script>