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
            maxlength="15"
            outlined
          />
        </v-col>

        <v-col cols="12" md="6" class="d-flex">
          <v-text-field
            v-model="fields.curp"
            label="CURP"
            maxlength="19"
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
            maxlength="80"
            outlined
          />
        </v-col>
        <v-col cols="12" md="4" class="d-flex">
          <v-text-field
            v-model="fields.telefono"
            label="Teléfono"
            maxlength="25"
            outlined
          />
        </v-col>
        <v-col cols="12" md="4" class="d-flex">
          <v-text-field
            v-model="fields.telefono_fijo"
            label="Tel. fijo"
            maxlength="25"
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
          <v-select
            v-model="nacionalidadSelected"
            :items="nacionalidades"
            item-value="id"
            name="nacionalidades"
            item-text="nombre"
            label="Nacionalidad"
            outlined
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="4" class="d-flex">
          <v-select
            v-model="paisSelected"
            :items="paises"
            item-value="id"
            name="paises"
            item-text="nombre"
            label="Pais"
            outlined
          />
        </v-col>
        <v-col cols="12" md="4" class="d-flex">
          <v-select
            v-model="estadoSelected"
            :items="estados"
            item-value="id"
            name="estados"
            item-text="nombre"
            label="Estado"
            outlined
          />
        </v-col>
        <v-col cols="12" md="4" class="d-flex">
          <v-select
            v-model="municipioSelected"
            :items="municipios"
            item-value="id"
            name="ciudades"
            item-text="nombre"
            label="Ciudad"
            outlined
          />
        </v-col>
      </v-row>
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
    <v-snackbar left v-model="snackbar" timeout="2500">
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
  name: "MiPerfilDatosComponent",
  data() {
    return {
      snackbar: false,
      text: "",
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
      nacionalidadSelected: 0,
      nacionalidades: [],
      paisSelected: 0,
      paises: [],
      estadoSelected: 0,
      estados: [],
      municipioSelected: 0,
      municipios: [],
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
        estados_id: "",
        paises_id: "",
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
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
    paisSelected() {
      this.consultarEstados();
    },
    estadoSelected() {
      this.consultarMunicipios();
    },
  },
  computed: {
    validar() {
      return (
        this.fields.nombre.length >= 3 &&
        this.fields.apellido_paterno.length >= 3 &&
        this.fields.apellido_materno.length >= 3 &&
        this.fields.rfc.length > 12 &&
        this.fields.curp.length > 16 &&
        this.validarCurp() &&
        this.generoSelected != 0 &&
        this.fields.telefono.length > 9 &&
        this.fields.telefono_fijo.length > 9 &&
        this.fields.fecha_nacimiento.length > 0 &&
        // this.rules.age > 0
        this.fields.correo_electronico.length > 0 &&
        this.estadoCivilSelected != 0 &&
        this.nacionalidadSelected != 0 &&
        this.municipioSelected != 0
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
        cmbNacionalidad: this.nacionalidadSelected,
        cmbMunicipio: this.municipioSelected,
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
          }
        }
      });
    },
    async consultarInfoUsuario() {
      try {
        this.options.method = "GET";
        this.options.body = null;

        let resp = await requests(this.route, this.options);

        switch (resp.estatus) {
          case "success": {
            this.fields = Object.assign({}, resp.data[0]);
            this.generoSelected = this.fields.genero;
            this.estadoCivilSelected = this.fields.estado_civil;
            this.nacionalidadSelected = this.fields.nacionalidad;
            this.paisSelected = this.fields.paises_id;
            break;
          }
          case "info": {
            this.limpiar();
            break;
          }
          case "error": {
            this.mensaje("Error!", `${resp.msg}`, "error");
            this.limpiar();
            break;
          }
          case "tokenError": {
            //se debe limpiar token y mandar a login
            this.$router.go();
            logout();
            break;
          }
        }
      } catch (error) {
        console.log(error);
        this.mensaje("Hable con un administrador!", "", "error");
      }
    },
    async consultarNacionalidades() {
      try {
        this.options.method = "GET";
        this.options.body = null;

        let resp = await requests(this.route + "/nacionalidades", this.options);

        if (resp.data !== null) {
          switch (resp.estatus) {
            case "success": {
              this.nacionalidades = resp.data;
              break;
            }
            case "info": {
              this.mensaje("Info!", `${resp.msg}`, "info");
              this.nacionalidades = [];
              break;
            }
            case "error": {
              this.mensaje("Error!", `${resp.msg}`, "error");
              this.nacionalidades = [];
              break;
            }
            case "tokenError": {
              this.$router.go();
              logout();
              break;
            }
          }
        }
      } catch (error) {
        console.log(error);
        this.mensaje("Hable con un administrador!", "", "error");
      }
    },
    async consultarPaises() {
      try {
        this.options.method = "GET";
        this.options.body = null;

        let resp = await requests(this.route + "/paises", this.options);

        switch (resp.estatus) {
          case "success": {
            this.paises = resp.data;
            break;
          }
          case "info": {
            this.mensaje("Error!", `${resp.msg}`, "info");
            this.paises = [];
            this.paisSelected = 0;
            this.estados = [];
            this.estadoSelected = 0;
            this.municipios = [];
            this.municipioSelected = 0;
            break;
          }
          case "error": {
            this.mensaje("Error!", `${resp.msg}`, "error");
            this.paises = [];
            this.paisSelected = 0;
            this.estados = [];
            this.estadoSelected = 0;
            this.municipios = [];
            this.municipioSelected = 0;
            break;
          }
          case "tokenError": {
            this.$router.go();
            logout();
            break;
          }
        }
      } catch (error) {
        console.log(error);
        this.mensaje("Hable con un administrador!", "", "error");
      }
    },
    async consultarEstados() {
      try {
        const params = {
          idPais: this.paisSelected,
        };

        this.options.method = "POST";
        this.options.body = JSON.stringify(params);

        let resp = await requests(this.route + "/estados", this.options);

        switch (resp.estatus) {
          case "success": {
            this.estados = resp.data;
            this.estadoSelected = this.fields.estados_id;
            break;
          }
          case "info": {
            this.mensaje("Info!", `${resp.msg}`, "info");
            this.estados = [];
            this.estadoSelected = 0;
            this.municipios = [];
            this.municipioSelected = 0;
            break;
          }
          case "error": {
            this.mensaje("Error!", `${resp.msg}`, "error");
            this.estados = [];
            this.estadoSelected = 0;
            this.municipios = [];
            this.municipioSelected = 0;
            break;
          }
          case "tokenError": {
            this.$router.go();
            logout();
            break;
          }
        }
      } catch (error) {
        console.log(error);
        this.mensaje("Hable con un administrador!", "", "error");
      }
    },
    async consultarMunicipios() {
      try {
        const params = {
          idEstado: this.estadoSelected,
        };

        this.options.method = "POST";
        this.options.body = JSON.stringify(params);

        let resp = await requests(this.route + "/municipios", this.options);

        switch (resp.estatus) {
          case "success": {
            this.municipios = resp.data;
            this.municipioSelected = this.fields.municipio;
            break;
          }
          case "info": {
            this.mensaje("Info!", `${resp.msg}`, "info");
            this.municipios = [];
            this.municipioSelected = 0;
            break;
          }
          case "error": {
            this.mensaje("Error!", `${resp.msg}`, "error");
            this.municipios = [];
            this.municipioSelected = 0;
            break;
          }
          case "tokenError": {
            this.$router.go();
            logout();
            break;
          }
        }
      } catch (error) {
        console.log(error);
        this.mensaje("Hable con un administrador!", "", "error");
      }
    },
    validarCurp() {
      const re =
          /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
        validado = this.fields.curp.match(re);

      if (!validado) {
        this.text = "Por favor, el formato del CURP no es correcto.";
        this.snackbar = true;
        return false;
      }

      //Validar que coincida el dígito verificador
      function digitoVerificador(curp17) {
        let diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
          lngSuma = 0.0,
          lngDigito = 0.0;
        for (let i = 0; i < 17; i++)
          lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
        lngDigito = 10 - (lngSuma % 10);
        if (lngDigito == 10) return 0;
        return lngDigito;
      }

      if (validado[2] != digitoVerificador(validado[1])) return false;

      return true; //Validado
    },
    limpiar() {
      this.fields.id = 0;
      this.fields.nombre = "";
      this.fields.apellido_paterno = "";
      this.fields.apellido_materno = "";
      this.fields.rfc = "";
      this.fields.curp = "";
      this.fields.genero = 0;
      this.fields.telefono = "";
      this.fields.telefono_fijo = "";
      this.fields.fecha_nacimiento = "";
      this.fields.edad = "";
      this.fields.imagen = 0;
      this.fields.correo_electronico = "";
      this.fields.estado_civil = 0;
      this.fields.nacionalidad = 0;
      this.fields.municipio = 0;
      this.fields.usuarios_correo = "";
      this.fields.usuarios_estatus = "";
      this.fields.estados_id = "";
      this.fields.paises_id = "";
      this.paises = [];
      this.paisSelected = 0;
      this.estados = [];
      this.estadoSelected = 0;
      this.municipios = [];
      this.municipioSelected = 0;
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
    this.consultarNacionalidades();
    this.consultarPaises();
    this.consultarInfoUsuario();
  },
};
</script>