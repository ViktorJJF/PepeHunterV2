<template>
  <div class="container custom-margin">
    <table class="table table-bordered border-primary">
      <thead>
        <tr>
          <th scope="col">Planeta</th>
          <th v-for="i in 24" :key="i" scope="col">{{ i }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td colspan="2">Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const ENTITY = 'activities';
import activitiesApi from '@/services/api/activities';

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
    // async search() {
    //   clearTimeout(this.delayTimer);
    //   this.delayTimer = setTimeout(() => {
    //     this.initialize(this.page);
    //   }, 600);
    // },
    async page() {
      this.initialize(this.page);
    },
  },
  async mounted() {
    console.log('el jugador: ', this.$route.params.playerId);
    this.initialize();
  },
  methods: {
    async initialize() {
      // llamada asincrona de items
      const responses = await Promise.all([
        activitiesApi.getActivitiesByDay(
          new Date(),
          this.$route.params.playerId,
        ),
      ]);
      // asignar al data del componente
      console.log('responses: ', responses);
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

<style lang="scss" scoped></style>
