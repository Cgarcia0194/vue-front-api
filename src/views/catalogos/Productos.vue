<template>
  <v-card class="py-8 px-7" fluid outlined>
    <v-card-text>
      <v-row>
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            v-model="selected"
            :items="categorias"
            item-value="id"
            name="category"
            item-text="nombre"
            label="Categorias"
          />
        </v-col>

        <v-col lg="12">
          <v-data-table
            :headers="headers"
            :items="data"
            :items-per-page="10"
            :loading="loadingTable"
            loading-text="Cargando... espere por favor"
            class="elevation-5"
          >
            <template v-slot:[`item.modificar`]="{ item }">
              <v-btn icon color="warning" @click="cargarInfo(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <template v-slot:[`item.desactivar_reactivar`]="{ item }">
              <v-btn
                v-if="item.estatus == 'Activo'"
                icon
                color="error"
                @click="desactivar(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn
                v-if="item.estatus == 'Inactivo'"
                icon
                color="success"
                @click="reactivar(item)"
              >
                <v-icon>mdi-update</v-icon>
              </v-btn>
            </template>

            <template v-slot:no-data>
              <v-alert
                color="info"
                border="left"
                elevation="2"
                colored-border
                icon="mdi-information-variant"
                class="ma-0"
              >
                {{ no_data }}
              </v-alert>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-btn fab color="primary" fixed right bottom @click="abrirDlg">
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>

    <v-btn fab color="primary" fixed right bottom @click="abrirDlg">
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>

    <!-- dialogo -->
    <div class="text-center">
      <v-dialog v-model="dialog" max-width="600px" min-width="300">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Productos
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="fields.nombre"
              label="Nombre"
              maxlength="100"
            />
            <v-text-field
              v-model="fields.descripcion"
              label="Descripción"
              maxlength="250"
            />
            <v-text-field
              v-model="fields.precio"
              label="Precio"
              maxlength="5"
            />
            <v-text-field
              v-model="fields.cantidad"
              label="Cantidad"
              maxlength="5"
            />
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="ma-2" outlined @click="cerrarDlg"> Cancelar </v-btn>
            <v-btn
              v-show="btnModificar"
              class="ma-2"
              outlined
              color="primary"
              :disabled="!validar"
              @click="modificarProducto"
            >
              Modificar
            </v-btn>
            <v-btn
              v-show="btnAgregar"
              class="ma-2"
              outlined
              color="primary"
              :disabled="!validar"
              @click="agregarProducto"
            >
              Agregar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar left v-model="snackbar" timeout="2500">
        {{ text }}
        <template v-slot:action="{ attrs }">
          <v-btn color="error" text v-bind="attrs" @click="snackbar = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
import { BACK_API } from "../../providers/conn-back";
import requests from "../../providers/requests";
import { logout, xToken } from "@/providers/auth.js";
export default {
  name: "ProductosPage",
  data() {
    return {
      snackbar: false,
      text: "",
      selected: 0,
      categorias: [{ id: 0, nombre: "Selecciona una opción" }],
      fields: {
        id: null,
        nombre: "",
        descripcion: "",
        precio: 0,
        cantidad: 0,
        categoriaId: null,
      },
      data: [],
      no_data: "No hay registros para mostrar",
      loadingTable: true,
      dialog: false,
      options: {
        method: null,
        headers: {
          "Content-Type": "application/json",
          "x-token": xToken,
          // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTY0OTUzODgyMCwiZXhwIjoxNjQ5NjI1MjIwfQ.nIUmkoptkaQosUAgI011nxGOPziCiHTcMHxKFV4f4P4",
        },
        body: null,
      },
      btnModificar: false,
      btnAgregar: false,
      route: `${BACK_API}/api/productos`,
      headers: [
        {
          text: "Nombre",
          align: "start",
          sortable: true,
          value: "nombre",
        },
        {
          text: "Descripción",
          align: "start",
          sortable: true,
          value: "descripcion",
        },
        {
          text: "Precio",
          align: "center",
          sortable: true,
          value: "precio",
        },
        {
          text: "Cantidad",
          align: "center",
          sortable: true,
          value: "cantidad",
        },
        {
          text: "Categoria",
          align: "start",
          sortable: false,
          value: "categoria_nombre",
        },
        { text: "Estatus", value: "estatus" },
        {
          text: "Modificar",
          value: "modificar",
          sortable: false,
          align: "center",
        },
        {
          text: "Desactivar / reactivar",
          value: "desactivar_reactivar",
          sortable: false,
          align: "center",
        },
      ],
    };
  },
  watch: {
    selected() {
      this.consultarProductos();
    },
  },
  computed: {
    validar() {
      return (
        this.fields.nombre.length >= 4 &&
        this.fields.descripcion.length >= 5 &&
        this.fields.precio >= 0 &&
        this.fields.cantidad >= 0
      );
    },
  },
  methods: {
    async agregarProducto() {
      const params = {
        txtNombre: this.fields.nombre,
        txtDescripcion: this.fields.descripcion,
        txtPrecio: this.fields.precio,
        txtCantidad: this.fields.cantidad,
        idCategoria: this.selected,
      };

      this.options.method = "POST";
      this.options.body = JSON.stringify(params);

      Swal.fire({
        title: "Confirma que deseas continuar",
        text: "Estás seguro de registrar la nueva categoria?",
        icon: "question",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, continuar!",
        preConfirm: async () => {
          return await requests(this.route, this.options);
        },
      }).then((result) => {
        if (result.isConfirmed) {
          switch (result.value.estatus) {
            case "success": {
              this.cerrarDlg();
              this.limpiar();
              this.consultarProductos();
              this.mensaje("Registrado!", `${result.value.msg}`, "success");
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
    async modificarProducto() {
      const params = {
        idProducto: this.fields.id,
        txtNombre: this.fields.nombre,
        txtDescripcion: this.fields.descripcion,
        txtPrecio: this.fields.precio,
        txtCantidad: this.fields.cantidad,
        idCategoria: this.selected,
      };

      this.options.method = "PUT";
      this.options.body = JSON.stringify(params);

      Swal.fire({
        title: "Confirma que deseas continuar",
        text: "Estás seguro de actualizar la categoria?",
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
              this.cerrarDlg();
              this.limpiar();
              this.consultarProductos();
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
    async desactivar(item) {
      const params = {
        idProducto: item.id,
        estatus: 2,
      };

      this.options.method = "DELETE";
      this.options.body = JSON.stringify(params);

      Swal.fire({
        title: "Confirma que deseas continuar",
        text: "Estás seguro de desactivar la categoria?",
        icon: "question",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, desactivar!",
        preConfirm: async () => {
          return await requests(this.route, this.options);
        },
      }).then((result) => {
        if (result.isConfirmed) {
          switch (result.value.estatus) {
            case "success": {
              this.cerrarDlg();
              this.limpiar();
              this.consultarProductos();
              this.mensaje("Actualizado!", `${result.value.msg}`, "success");
              break;
            }
            case "error": {
              this.mensaje("Error!", `${result.value.msg}`, "error");
              this.limpiar();
              this.consultarProductos();
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
    async reactivar(item) {
      const params = {
        idProducto: item.id,
        estatus: 1,
      };

      this.options.method = "DELETE";
      this.options.body = JSON.stringify(params);

      Swal.fire({
        title: "Confirma que deseas continuar",
        text: "Estás seguro de reactivar la categoria?",
        icon: "question",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, reactivar!",
        preConfirm: async () => {
          return await requests(this.route, this.options);
        },
      }).then((result) => {
        if (result.isConfirmed) {
          switch (result.value.estatus) {
            case "success": {
              this.cerrarDlg();
              this.limpiar();
              this.consultarProductos();
              this.mensaje("Actualizado!", `${result.value.msg}`, "success");
              break;
            }
            case "error": {
              this.mensaje("Error!", `${result.value.msg}`, "error");
              this.limpiar();
              this.consultarProductos();
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
    async consultarProductos() {
      try {
        const params = {
          idCategoria: this.selected,
        };

        this.options.method = "POST";
        this.options.body = JSON.stringify(params);

        let resp = await requests(this.route + "/productos", this.options);

        if (resp.data === null) {
          this.data = [];
        } else {
          switch (resp.estatus) {
            case "success": {
              this.data = resp.data;
              this.loadingTable = false;
              break;
            }
            case "info": {
              this.loadingTable = false;
              break;
            }
            case "error": {
              this.mensaje("Error!", `${result.value.msg}`, "error");
              this.limpiar();
              this.consultarProductos();
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
    async consultarCategorias() {
      try {
        this.options.method = "GET";
        this.options.body = null;

        let resp = await requests(
          `${BACK_API}/api/productos/categorias`,
          this.options
        );

        switch (resp.estatus) {
          case "success": {
            this.categorias = resp.data;
            this.loadingTable = false;
            break;
          }
          case "info": {
            this.loadingTable = false;
            break;
          }
          case "error": {
            this.mensaje("Error!", `${result.value.msg}`, "error");
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
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Hable con un administrador",
          text: "",
          icon: "error",
        });
      }
    },
    cargarInfo(item) {
      console.log(item);
      this.fields = Object.assign({}, item);
      this.dialog = true;
      this.btnAgregar = false;
      this.btnModificar = true;
    },
    abrirDlg() {
      if (Number(this.selected) === 0) {
        this.text = "Por favor, selecciona una categoria.";
        this.snackbar = true;
        return false;
      }
      this.btnAgregar = true;
      this.btnModificar = false;
      this.limpiar();
      this.dialog = true;
    },
    cerrarDlg() {
      this.dialog = false;
    },
    limpiar() {
      this.fields.id = null;
      this.fields.nombre = "";
      this.fields.descripcion = "";
      this.fields.precio = 0;
      this.fields.cantidad = 0;
      this.fields.categoriaId = null;
    },
    mensaje(title, text, icon) {
      Swal.fire(title, text, icon);
    },
  },
  created() {
    this.consultarCategorias();
  },
};
</script>