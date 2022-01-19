<template>
  <div class="container custom-margin">
    <div v-if="players && players.length > 0">
      <div>
        <b>Último escaneo militar: </b>
        {{ $filters.formatDateWithHour(players[0].updatedAt) }}
      </div>
      <div>
        <b>Último escaneo de actividad/universo: </b>
        {{ $filters.formatDateWithHour(players[0].planets[0].updatedAt) }}
      </div>
    </div>
    <br />
    <br />
    <el-table
      stripe
      :data="players"
      :default-sort="{ prop: 'date', order: 'descending' }"
      style="width: 100%"
    >
      <el-table-column prop="rank" label="rank" sortable />
      <el-table-column prop="rankMilitary" label="Rank Militar" sortable />
      <el-table-column prop="isOn" label="¿Está on? " sortable>
        <template #default="scope">
          {{
            scope.row.isOn === true
              ? 'Sí'
              : scope.row.isOn === false
              ? 'No'
              : 'No Escaneado'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="isOn" label="¿Está on en principal? " sortable>
        <template #default="scope">
          {{
            scope.row.isOnPrincipal === true
              ? 'Sí'
              : scope.row.isOnPrincipal === false
              ? 'No'
              : 'No Escaneado'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Jugador" sortable>
        <template #default="scope">
          <span>{{
            scope.row.planets && scope.row.planets.length > 0
              ? scope.row.planets[0].playerName
              : scope.row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="planets" label="Planetas" sortable>
        <template #default="scope">
          <span
            title=""
            class="tooltip fleft playerstatus online tpd-hideOnClickOutside"
          >
          </span>
          <span style="white-space: pre-line">{{
            scope.row.planets
              .map(
                (planet) =>
                  (planet.coords === scope.row.mainPlanet
                    ? planet.coords + ' (Principal)'
                    : planet.coords) + (planet.moon ? ' 🌘' : ''),
              )
              .join('\n')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="militaryPoints"
        label="Puntos militares"
        sortable
      />
      <el-table-column prop="numberOfShips" label="Número de naves" sortable />
      <el-table-column prop="ratio" label="Razón" sortable></el-table-column>
    </el-table>
  </div>
</template>

<script>
const ENTITY = 'players';
export default {
  components: {},
  data() {
    return {
      headers: [
        { text: 'Fecha', value: 'createdAt' },
        { text: 'Nombre', value: 'name' },
        { text: 'Acciones', value: 'actions', width: '15%' },
      ],
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
      selectedGalaxy: 1,
      systems: [],
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
    async initialize(page = 1) {
      this.systems = [];
      // llamada asincrona de items
      await Promise.all([
        this.$store.dispatch(ENTITY + 'Module/list', {
          page,
          search: this.search,
          fieldsToSearch: this.fieldsToSearch,
          order: 1,
          sort: 'rank',
          limit: 99999,
        }),
      ]);
      // asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + 'Module'][ENTITY],
      ).map((el) => ({
        ...el,
        isOn:
          el.planets && el.planets.length > 0
            ? el.planets.some(
                (planet) =>
                  planet &&
                  planet.planetActivity &&
                  (planet.planetActivity === 'on' ||
                    planet.moonActivity === 'on'),
              )
            : 'SIN INFORMACIÓN',
        isOnPrincipal:
          el.planets && el.planets.length > 0
            ? el.planets.find((planet) => planet.coords === el.mainPlanet)
              ? el.planets.find((planet) => planet.coords === el.mainPlanet)
                  .planetActivity === 'on'
              : 'SIN INFORMACIÓN'
            : 'SIN INFORMACIÓN',
        ratio: (el.numberOfShips / el.militaryPoints).toFixed(2),
      }));
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
  },
};
</script>

<style lang="scss" scoped>
</style>
