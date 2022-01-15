<template>
  <div class="row gutters">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
      <simple-table
        :items-per-page-custom="productsToShow || null"
        :headers="headers"
        :items="items"
        date-to-filter="fechaFin"
        :filterBox="true"
        :filterDate="false"
      >
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ $filters.formatDate(item.createdAt) }}
        </template>
        <template v-slot:[`item.stock`]="{ item }">
          {{ item.stock }}
          <el-tooltip
            v-if="item.stock < item.minStock"
            content="Por debajo de stock mínimo"
            placement="top"
          >
            <i
              class="icon-warning1 text-danger fa-sm"
              style="font-size: 1.3em"
            ></i>
          </el-tooltip>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <div class="d-flex align-items-center">
            <img
              v-show="item.img"
              :src="item.img"
              alt="image"
              width="90"
              class="img-fluid rounded avatar-50 mr-3"
            />
            <div>
              {{ item.name
              }}<span v-show="isSale || isPurchase">
                -
                {{
                  $store.getters['brandsModule/getBrandNameById'](item.brandId)
                }}</span
              >
            </div>
          </div>
        </template>
        <template v-slot:[`item.purchasePrice`]="{ item }">
          S/. {{ item.purchasePrice }}
        </template>
        <template v-slot:[`item.price`]="{ item }">
          S/. {{ item.price }}
        </template>
        <template v-slot:[`item.brandId`]="{ item }">
          {{
            $store.state.brandsModule.brands.find(
              (brand) => brand.id === item.brandId,
            )
              ? $store.state.brandsModule.brands.find(
                  (brand) => brand.id === item.brandId,
                ).name
              : 'Sin marca'
          }}
        </template>
        <template v-slot:[`item.qty`]="{ item }">
          <VTextFieldWithValidation
            type="number"
            v-model="item.qty"
            :errors="item.errors"
            :placeholder="isPurchase ? '' : 'Máximo ' + item.stock"
          />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div v-if="!isSale && !isPurchase" class="btn-group btn-group-sm">
            <button
              @click="
                $router.push({ name: 'ProductsAdd', params: { id: item.id } })
              "
              type="button"
              class="btn btn-info"
            >
              <i class="icon-edit1"></i>
            </button>
            <button
              @click="deleteItem(item)"
              type="button"
              class="btn btn-danger"
            >
              <i class="icon-cancel"></i>
            </button>
          </div>
          <div v-else>
            <button
              v-if="isSale"
              @click="addToSale(item)"
              type="button"
              class="btn btn-warning"
            >
              Agregar</button
            ><button
              v-if="isPurchase"
              @click="addToPurchase(item)"
              type="button"
              class="btn btn-warning"
            >
              Agregar
            </button>
          </div>
        </template>
      </simple-table>
    </div>
  </div>
</template>

<script>
const ENTITY = 'products';

import vuelidate from '@/plugins/vuelidate';
import SimpleTable from '@/components/template/SimpleTable.vue';
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation.vue';
import { searchItem } from '@/utils/utils';

export default {
  emits: ['addToSale', 'addToPurchase'],
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    productsToShow: {
      type: Number,
      default: null,
    },
    isPurchase: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SimpleTable,
    VTextFieldWithValidation,
  },
  setup() {
    return { v$: vuelidate.useVuelidate() };
  },
  validations() {
    return {
      items: {
        $each: {
          qty: { required: vuelidate.required },
        },
      },
    };
  },
  data() {
    return {
      fieldsToSearch: ['name'],
      delayTimer: null,
      [ENTITY]: [],
      editedIndex: -1,
      // configuracion de la tabla
      pagination: {},
      dataTableLoading: true,
      page: 1,
      pageCount: 0,
      loadingButton: false,
      search: '',
      dialog: false,
      selectedBrand: null,
      selectedBrandId: null,
    };
  },
  computed: {
    totalItems() {
      return this.$store.state[ENTITY + 'Module'].total;
    },
    totalPages() {
      return this.$store.state[ENTITY + 'Module'].totalPages;
    },
    items() {
      return this[ENTITY];
    },
    entity() {
      return ENTITY;
    },
  },
  watch: {
    async search() {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        this.initialize(this.page);
      }, 600);
    },
    async page() {
      this.initialize(this.page);
    },
  },
  async mounted() {
    this.initialize();
  },
  methods: {
    async initialize() {
      // asignar al data del componente con campo extra agregado (nombre producto + marca) para busqueda
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + 'Module'][ENTITY],
      );
    },
    async deleteItem(item) {
      const index = this[ENTITY].indexOf(item);
      let itemId = this[ENTITY][index].id;
      this.$swal
        .fire({
          title: '¿Estás seguro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, elimínalo!',
          cancelButtonText: 'No, mantenerlo',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.$store.dispatch(ENTITY + 'Module/delete', itemId);
            this[ENTITY].splice(index, 1);
          }
        });
    },
    addToSale(item) {
      if (
        (!item.qty || parseInt(item.qty, 10) < 1 || item.qty > item.stock) &&
        !this.isPurchase
      ) {
        item['errors'] = [{ $message: 'Agrega una cantidad válida' }];
        return;
      }
      item['errors'] = [];
      this.$emit('addToSale', item);
      item.qty = null;
    },
    addToPurchase(item) {
      this.$emit('addToPurchase', item);
      item.qty = null;
    },
    getBrands($event, callback) {
      this.brands = this.$store.state.brandsModule.brands;
      callback(searchItem($event, this.brands, ['name']));
    },
    brandAutocompleteChange($event) {
      if ($event.length === 0) {
        // reiniciar listado sin marcas
        this.selectedBrandId = null;
        this.initialize();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
