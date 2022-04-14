<template>
  <v-card flat>
    <v-card-text>
      <v-row justify="center">
        <v-col cols="12" md="4" sm="10" class="d-flex">
          <v-text-field
            v-model="fields.nombre"
            label="Nombre"
            maxlength="100"
            outlined
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="fields.apellido_paterno"
            label="Apellido Paterno"
            maxlength="100"
            outlined
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="fields.apellido_materno"
            label="Apellido Materno"
            maxlength="100"
            outlined
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="6" class="d-flex">
          <v-text-field
            v-model="fields.rfc"
            label="RFC"
            maxlength="100"
            outlined
          />
        </v-col>

        <v-col cols="12" md="6" class="d-flex">
          <v-text-field
            v-model="fields.curp"
            label="CURP"
            maxlength="100"
            outlined
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="4" class="d-flex">
          <v-select
            v-model="generoSelected"
            :items="generos"
            item-value="id"
            name="generos"
            item-text="nombre"
            label="Género"
            outlined
          />
        </v-col>

        <v-col cols="12" md="4" class="d-flex">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fields.fecha_nacimiento"
                label="Fecha nacimiento"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fields.fecha_nacimiento"
              :active-picker.sync="activePicker"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              locale="df-mx"
              min="1930-01-01"
              @change="save"
            ></v-date-picker>
          </v-menu>

          <!-- <v-text-field
            v-model="fields.fecha_nacimiento"
            label="Fecha nac."
            maxlength="100"
            outlined
          /> -->
        </v-col>
        <v-col cols="12" md="4" class="d-flex">
          <v-slider
            v-model="fields.edad"
            :rules="rules.age"
            color="orange"
            label="Edad"
            hint="Sé honesto"
            min="1"
            max="100"
            thumb-label="always"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="4" class="d-flex">
          <v-text-field
            v-model="fields.correo_electronico"
            label="Correo"
            maxlength="100"
            outlined
          />
        </v-col>
        <v-col cols="12" md="4" class="d-flex">
          <v-text-field
            v-model="fields.telefono"
            label="Teléfono"
            maxlength="100"
            outlined
          />
        </v-col>
        <v-col cols="12" md="4" class="d-flex">
          <v-text-field
            v-model="fields.telefono_fijo"
            label="Tel. fijo"
            maxlength="100"
            outlined
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="6" class="d-flex">
          <v-select
            v-model="estadoCivilSelected"
            :items="estadosCiviles"
            item-value="id"
            name="estadosCiviles"
            item-text="nombre"
            label="Estado civil"
            outlined
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex">
          <v-select label="Nacionalidad" outlined />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="4" class="d-flex">
          <v-select label="País" outlined />
        </v-col>
        <v-col cols="12" md="4" class="d-flex">
          <v-select label="Estado" outlined />
        </v-col>
        <v-col cols="12" md="4" class="d-flex">
          <v-select label="Ciudad" outlined />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        class="ma-2"
        outlined
        color="primary"
        :disabled="validar"
        @click="modificar"
      >
        Modificar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { BACK_API } from "../../../providers/conn-back";
import Swal from "sweetalert2";
import requests from "../../../providers/requests";
import { logout, xToken } from "../../../providers/auth.js";

export default {
  name: "MiPerfilDatosComponent",
  data() {
    // const defaultForm = Object.freeze({
    //   age: null,
    // });
    return {
      // defaultForm,
      // form: Object.assign({}, null),
      rules: {
        age: [(val) => val < 45 || `De verdad!`],
      },
      activePicker: null,
      menu: false,

      generoSelected: 0,
      generos: [
        { id: 0, nombre: "Selecciona una opción" },
        { id: "Hombre", nombre: "Hombre" },
        { id: "Mujer", nombre: "Mujer" },
        { id: "Sin especificar", nombre: "Sin especificar" },
      ],
      estadoCivilSelected: 0,
      estadosCiviles: [
        { id: 0, nombre: "Selecciona una opción" },
        { id: "Casado", nombre: "Casado" },
        { id: "Divorciado", nombre: "Divorciado" },
        { id: "Soltero", nombre: "Soltero" },
        { id: "Unión libre", nombre: "Unión libre" },
        { id: "Viudo", nombre: "Viudo" },
        { id: "Sin especificar", nombre: "Sin especificar" },
      ],
      fields: {
        id: 0,
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
        imagen: 0,
        correo_electronico: "",
        estado_civil: 0,
        nacionalidad: 0,
        municipio: 0,
        usuarios_correo: "",
        usuarios_estatus: "",
      },
      route: `${BACK_API}/api/personas`,
      options: {
        method: null,
        headers: {
          "Content-Type": "application/json",
          "x-token": xToken,
          // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTY0OTUzODgyMCwiZXhwIjoxNjQ5NjI1MjIwfQ.nIUmkoptkaQosUAgI011nxGOPziCiHTcMHxKFV4f4P4",
        },
        body: null,
      },
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  computed: {
    validar() {
      return (
        this.fields.nombre.length >= 3 &&
        this.fields.apellido_paterno.length >= 3 &&
        this.fields.apellido_materno.length >= 3 &&
        this.fields.rfc.length > 0 &&
        this.fields.curp.length > 0 &&
        this.fields.genero.length > 0 &&
        this.fields.telefono.length > 0 &&
        this.fields.telefono_fijo.length > 0 &&
        this.fields.fecha_nacimiento.length > 0 &&
        this.fields.edad.length > 0 &&
        this.fields.correo_electronico.length > 0 &&
        this.fields.estado_civil.length > 0 &&
        this.fields.nacionalidad.length > 0 &&
        this.fields.municipio.length > 0
      );
    },
  },
  methods: {
    async modificar() {
      const params = {
        idPersona: this.fields.id,
        txtNombre: this.fields.nombre,
        txtApellidoPaterno: this.fields.apellido_paterno,
        txtApellidoMaterno: this.fields.apellido_materno,
        txtRFC: this.fields.rfc,
        txtCURP: this.fields.curp,
        cmbGenero: this.generoSelected,
        txtTel: this.fields.telefono,
        txtTelFijo: this.fields.telefono_fijo,
        txtFechaNac: this.fields.fecha_nacimiento,
        txtEdad: this.fields.edad,
        txtCorreo: this.fields.correo_electronico,
        cmbEstadoCivil: this.estadoCivilSelected,
        cmbNacionalidad: 1,
        cmbMunicipio: 1,
      };

      this.options.method = "PUT";
      this.options.body = JSON.stringify(params);

      console.log(params);

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
          return await requests(this.route, this.options);
        },
      }).then((result) => {
        if (result.isConfirmed) {
          switch (result.value.estatus) {
            case "success": {
              this.consultarInfoUsuario();
              this.mensaje("Actualizado!", `${result.value.msg}`, "success");
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
            default: {
            }
          }
        }
      });
    },
    async consultarInfoUsuario() {
      try {
        this.options.method = "GET";
        this.options.body = null;

        let resp = await requests(this.route, this.options);

        if (resp.data !== null) {
          switch (resp.estatus) {
            case "success": {
              this.fields = Object.assign({}, resp.data[0]);
              this.generoSelected = this.fields.genero;
              this.estadoCivilSelected = this.fields.estado_civil;
              console.log(this.fields);
              break;
            }
            case "info": {
              break;
            }
            case "error": {
              this.mensaje("Error!", `${result.value.msg}`, "error");
              this.limpiar();
              break;
            }
            case "tokenError": {
              //se debe limpiar token y mandar a login
              this.$router.go();
              logout();
              break;
            }
            default: {
            }
          }
        }
      } catch (error) {
        console.log(error);
        this.mensaje("Hable con un administrador!", "", "error");
      }
    },
    mensaje(title, text, icon) {
      Swal.fire(title, text, icon);
    },
    save(date) {
      this.$refs.menu.save(date);
      this.fields.fecha_nacimiento = date;
    },
  },
  created() {
    this.consultarInfoUsuario();
  },
};
</script>