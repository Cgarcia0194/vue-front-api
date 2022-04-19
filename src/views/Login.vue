
<template>
  <v-app>
    <v-main>
      <v-card width="500px" class="mx-auto mt-12">
        <v-card-title align-center>Inicio de sesión</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="txtCorreo"
            label="Usuario"
            prepend-icon="mdi-account-circle"
          ></v-text-field>
          <v-text-field
            label="Contraseña"
            v-model="txtContrasenia"
            :type="showPss ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="showPss ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword()"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="ingresar()" :disabled="!validar" color="info"
            >Ingresar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import Swal from "sweetalert2";
import { login } from "@/providers/auth.js";
import { BACK_API } from "../providers/conn-back";

export default {
  name: "LoginPage",
  data() {
    return {
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: null,
      },
      route: `${BACK_API}/api/auth/login`,
      showPss: false,
      txtCorreo: "",
      txtContrasenia: "",
    };
  },
  computed: {
    validar() {
      return this.txtCorreo.length > 0 && this.txtContrasenia.length > 0;
    },
  },
  methods: {
    showPassword() {
      this.showPss = !this.showPss;
    },
    async ingresar() {
      const data = {
        txtCorreo: this.txtCorreo,
        txtContrasenia: this.txtContrasenia,
      };

      this.options.body = JSON.stringify(data);

      await fetch(this.route, this.options)
        .then((resp) => resp.json())
        .then((info) => {
          switch (info.estatus) {
            case "success": {
              const { token, usuario } = info.data;

              const inicio = login(token, usuario);

              Swal.fire({
                icon: "info",
                title: "Bienvenido " + usuario.nombre_completo,
                didOpen: () => {
                  Swal.showLoading();
                },
              });

              setTimeout(() => {
                this.$router.go();
              }, 2000);

              if (!inicio) {
                Swal.fire({
                  title: "Hable con un administrador",
                  text: "",
                  icon: "error",
                });
              }
              break;
            }
            default: {
              const { estatus, msg } = info;

              Swal.fire({
                title: msg,
                text: "",
                icon: estatus,
              });
              break;
            }
          }
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            title: "Hable con un administrador",
            text: "",
            icon: "error",
          });
        });
    },
  },
};
</script>
