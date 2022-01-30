<template>
  <div class="container custom-margin" v-if="player">
    <el-descriptions :column="3" border>
      <el-descriptions-item
        label="Jugador"
        label-align="left"
        align="center"
        label-class-name="my-label"
        class-name="my-content"
        ><h3>{{ player.name }}</h3></el-descriptions-item
      >
      <el-descriptions-item label="Rank" label-align="left" align="left"
        ><h3>{{ player.rank }}</h3></el-descriptions-item
      >
    </el-descriptions>
    <el-descriptions :column="3" border>
      <el-descriptions-item
        label="Conectado"
        label-align="left"
        align="center"
        label-class-name="my-label"
        class-name="my-content"
        ><h3>
          <el-tag size="large" type="danger">{{
            overviewActivities.find((el) => el._id === 'on')
              ? (
                  (overviewActivities.find((el) => el._id === 'on').count /
                    totalActivities) *
                  100
                ).toFixed(2) + ' %'
              : '0  %'
          }}</el-tag>
        </h3></el-descriptions-item
      >
      <el-descriptions-item
        label="Con minuteros"
        label-align="left"
        align="left"
        ><h3>
          <el-tag size="large" type="warning">{{
            overviewActivities.find((el) => el._id === 'partiallyOff')
              ? (
                  (overviewActivities.find((el) => el._id === 'partiallyOff')
                    .count /
                    totalActivities) *
                  100
                ).toFixed(2) + ' %'
              : '0  %'
          }}</el-tag>
        </h3></el-descriptions-item
      >
      <el-descriptions-item label="Dormido" label-align="left" align="left"
        ><h3>
          <el-tag size="large" type="success">{{
            overviewActivities.find((el) => el._id === 'off')
              ? (
                  (overviewActivities.find((el) => el._id === 'off').count /
                    totalActivities) *
                  100
                ).toFixed(2) + ' %'
              : '0  %'
          }}</el-tag>
        </h3></el-descriptions-item
      >
    </el-descriptions>
  </div>
  <div class="custom-margin" v-if="player">
    <table class="table table-bordered border-primary">
      <thead>
        <tr>
          <th scope="col">Planeta</th>
          <th scope="col">Tipo</th>
          <th v-for="i in 24" :key="i" scope="col">
            {{ formatHourHeader(i) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(planet, planetIndex) in planetsWithMoons"
          :key="planetIndex"
        >
          <th scope="row">
            {{ planet.type === 'moon' ? 'Luna' : planet.name
            }}{{
              planet.coords === player.mainPlanet && planet.type === 'planet'
                ? ' (principal)'
                : ''
            }}
            [{{ planet.coords }}]
          </th>
          <th scope="row">
            {{ planet.type === 'moon' ? 'Luna' : 'Planeta' }}
            {{ planet.type === 'moon' ? '🌘' : '🌎' }}
          </th>
          <td
            v-for="(activity, activityIndex) in activities"
            :key="activityIndex"
          >
            <p
              v-for="(date, dateIndex) in filterActivitiesByCoords(
                activity,
                planet.coords,
                planet.type,
              )"
              :key="dateIndex"
              :class="{
                onState: date.lastActivity === 'on',
                minuteState:
                  date.lastActivity !== 'on' && date.lastActivity !== 'off',
                offState: date.lastActivity === 'off',
              }"
            >
              {{ $filters.formatHour(date.createdAt) }} {{ date.lastActivity }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

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
      player: null,
      planets: null,
      planetsWithMoons: null,
      overviewActivities: [],
    };
  },
  computed: {
    totalItems() {
      return this.$store.state[ENTITY + 'Module'].total;
    },
    totalPages() {
      return this.$store.state[ENTITY + 'Module'].totalPages;
    },
    totalActivities() {
      return this.overviewActivities.reduce((acc, el) => acc + el.count, 0);
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
        this.$store.dispatch('playersModule/list', {
          _id: this.$route.params.playerId,
        }),
        activitiesApi.getActivitiesByDay(
          new Date(),
          this.$route.params.playerId,
        ),
        axios.get(
          '/api/overview-activities/count-by-player/' +
            this.$route.params.playerId,
        ),
      ]);
      this.player = responses[0][0];
      this.overviewActivities = responses[2].data.payload;
      console.log(
        '🚀 Aqui *** -> this.overviewActivities',
        this.overviewActivities,
      );
      console.log('🚀 Aqui *** -> this.player', this.player);

      this.planets = this.player.planets;
      // separando planetas de lunas
      this.planetsWithMoons = this.planets.reduce((acc, el) => {
        if (el.moon) {
          acc.push({ ...el, type: 'planet' });
          acc.push({ ...el, type: 'moon' });
        } else {
          acc.push({ ...el, type: 'planet' });
        }
        return acc;
      }, []);
      this.activities = responses[1].data.payload;
      let { planets } = this.player;
      console.log('🚀 Aqui *** -> this.activities', this.activities);

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
    filterActivitiesByCoords(activities, coords, type) {
      return activities
        ? activities.filter(
            (activity) => activity.coords === coords && activity.type === type,
          )
        : [];
    },
    formatHourHeader(index) {
      let today = new Date();

      let myToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        index - 1,
        0,
        0,
      );
      return this.$filters.formatHourHeader(myToday);
    },
  },
};
</script>

<style lang="scss" scoped></style>
