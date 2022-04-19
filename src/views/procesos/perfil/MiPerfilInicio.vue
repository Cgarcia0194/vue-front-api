<template>
  <v-card flat>
    <v-card-text>
      <v-text-field
        v-model="fields.txtCorreo"
        label="Usuario"
        prepend-icon="mdi-account-circle"
        outlined
      ></v-text-field>
      <v-text-field
        label="Contraseña actual"
        v-model="fields.txtContraseniaActual"
        :type="showPss ? 'text' : 'password'"
        prepend-icon="mdi-lock"
        :append-icon="showPss ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword()"
        outlined
      ></v-text-field>
      <v-text-field
        label="Nueva contraseña"
        v-model="fields.txtContraseniaNueva"
        :type="showPssNuevaPss ? 'text' : 'password'"
        prepend-icon="mdi-key"
        :append-icon="showPssNuevaPss ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPasswordNueva()"
        outlined
      ></v-text-field>
      <v-text-field
        label="Confirmación nueva contraseña"
        v-model="fields.txtContraseniaNuevaConf"
        :type="showPssNuevaPssConf ? 'text' : 'password'"
        prepend-icon="mdi-key"
        :append-icon="showPssNuevaPssConf ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPasswordConfir()"
        outlined
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        class="ma-2"
        outlined
        color="primary"
        :disabled="!validar"
        @click="modificar"
      >
        Actualizar
      </v-btn>
    </v-card-actions>
    <v-snackbar left v-model="snackbar" timeout="3500">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="error" text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { BACK_API } from "@/providers/conn-back";
import Swal from "sweetalert2";
import requests from "@/providers/requests";
import { logout, xToken } from "@/providers/auth.js";

export default {
  name: "MiPerfilInicioComponent",
  data() {
    return {
      snackbar: false,
      text: "",
      showPss: false,
      showPssNuevaPss: false,
      showPssNuevaPssConf: false,
      fields: {
        id: 0,
        txtCorreo: "",
        txtContraseniaActual: "",
        txtContraseniaNueva: "",
        txtContraseniaNuevaConf: "",
      },
      route: `${BACK_API}/api/personas`,
      options: {
        method: null,
        headers: {
          "Content-Type": "application/json",
          "x-token": xToken,
        },
        body: null,
      },
    };
  },
  computed: {
    validar() {
      return (
        this.fields.txtCorreo.length >= 3 &&
        this.fields.txtContraseniaActual.length >= 3 &&
        this.fields.txtContraseniaNueva.length >= 3 &&
        this.fields.txtContraseniaNuevaConf.length >= 3 &&
        this.validarContraseniaNueva()
      );
    },
  },
  methods: {
    showPassword() {
      this.showPss = !this.showPss;
    },
    showPasswordNueva() {
      this.showPssNuevaPss = !this.showPssNuevaPss;
    },
    showPasswordConfir() {
      this.showPssNuevaPssConf = !this.showPssNuevaPssConf;
    },
    async modificar() {
      const params = {
        txtCorreo: this.fields.txtCorreo,
        txtContraseniaActual: this.fields.txtContraseniaActual,
        txtContraseniaNueva: this.fields.txtContraseniaNueva,
      };

      this.options.method = "PUT";
      this.options.body = JSON.stringify(params);

      Swal.fire({
        title: "Confirma que deseas continuar",
        text: "Estás seguro de actualizar tú información?",
        icon: "question",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, actualizar!",
        preConfirm: async () => {
          return await requests(this.route + "/usuario", this.options);
        },
      }).then((result) => {
        if (result.isConfirmed) {
          switch (result.value.estatus) {
            case "success": {
              this.mensaje("Actualizado!", `${result.value.msg}`, "success");
              Swal.fire({
                title: "Actualizado!",
                text: `${result.value.msg}`,
                icon: "success",
                confirmButtonText: "Ok",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    icon: "info",
                    title: "Cerrando sesión, espere...",
                    didOpen: () => {
                      Swal.showLoading();
                    },
                  });

                  setTimeout(() => {
                    logout();
                    this.$router.go();
                  }, 3000);

                }
              });

              break;
            }
            case "info": {
              this.mensaje("Info!", `${result.value.msg}`, "info");
              break;
            }
            case "error": {
              this.mensaje("Error!", `${result.value.msg}`, "error");
              break;
            }
            case "tokenError": {
              this.$router.go();
              logout();
              break;
            }
          }
        }
      });
    },
    validarContraseniaNueva() {
      if (
        this.fields.txtContraseniaNueva == this.fields.txtContraseniaNuevaConf
      ) {
        return true;
      } else {
        this.text =
          "Por favor, el campo nueva contraseña y confirmación de contraseña no coinciden.";
        this.snackbar = true;
        return false;
      }
    },
    mensaje(title, text, icon) {
      Swal.fire(title, text, icon);
    },
  },
};
</script>