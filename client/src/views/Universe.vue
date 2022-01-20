<template>
  <div class="container custom-margin">
    <form action="/universo" method="POST">
      <label for="playerNameInput"><b># de Galaxia</b></label>
      <el-select
        v-model="selectedGalaxy"
        class="m-2"
        placeholder="Select"
        size="large"
        @change="initialize()"
      >
        <el-option v-for="i in 5" :key="i" :label="i" :value="i"> </el-option>
      </el-select>
    </form>
    <div class="row">
      <div class="col-sm-3">
        <b>Resaltar por ranking</b>
        <div class="mb-2">
          <span class="mx-2">desde</span>
          <el-input v-model="minRank" type="number" placeholder="Mínimo" />
        </div>
        <div>
          <span class="mx-2">hasta</span>
          <el-input v-model="maxRank" type="number" placeholder="Máximo" />
        </div>
      </div>
      <div class="col-sm-3">
        <b>Resaltar por alianza</b>
        <div class="mb-2">
          <el-autocomplete
            v-model="selectedAlliance"
            style="display: block"
            :fetch-suggestions="($event, callback) => callback(alliances)"
            placeholder="Seleccione una alianza"
            @select="selectedAllianceName = $event._id"
            value-key="nameWithMembers"
          ></el-autocomplete>
        </div>
      </div>
    </div>
    <h2 class="mb-2">
      Distribución de galaxia {{ selectedGalaxy }} -
      <small>Último scaneo {{ $filters.formatDate(new Date()) }}</small>
    </h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">#</th>

          <th v-for="(i, idx) in 15" :key="idx" scope="col">
            {{ idx + 1 }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(system, i) in systems" :key="i + 'solarSystem'">
          <th scope="row">[{{ selectedGalaxy }}:{{ i + 1 }}:x]</th>
          <td
            :class="
              planet.state +
              ' ' +
              (planet.honor
                ? meetFilterConditions(planet)
                  ? 'filterPlayer'
                  : 'yellowPlayer'
                : '')
            "
            v-for="(planet, planetIndex) in system"
            :key="planetIndex"
          >
            <span
              v-if="planet.rankTitle"
              :class="'honorRank ' + getRankClass(planet.rankTitle)"
            ></span>
            <span v-if="planet.moon" class="moon_a"></span>
            <div v-if="!planet.isAdmin" class="mt-4">{{ planet.rank }}</div>
          </td>
          <!-- {{#each solarSystem}}
          {{#if (planetExist this)}}
          {{#if this.honor}}

          {{else}}
          {{#if_eq this.playerName ""}}
          <td class="red"></td>
          {{else}}
          <td class="{{this.state}}">
            {{#if_eq this.state 'bandit'}}
            <span class="honorRank rank_bandit3"></span>
            {{/if_eq}}
            {{#if this.moon}}
            <span class="moon_a"></span>
            {{/if}}
            {{#if_eq ../../showRanking 'true'}}
            <div class="mt-4">{{ this.rank }}</div>
            {{/if_eq}}
          </td>
          {{/if_eq}}

          {{!-- {{#if_eq this.state 'green'}}
          <td>
            <div class="greenPlayer"></div>
          </td>
          {{else}}
          <td>
            <div class="whitePlayer"></div>
          </td>
          {{/if_eq}}
          --}}

          {{/if}}
          {{else}}
          <td></td>
          {{/if}}
          {{/each}}
        </tr>
        {{/each}} -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const ENTITY = 'planets';
import planetsApi from '@/services/api/planets';

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
      minRank: 0,
      maxRank: 0,
      alliances: [],
      selectedAlliance: '',
      selectedAllianceName: '',
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
    selectedAlliance() {
      console.log('entrando: ', this.selectedAlliance);
      if (this.selectedAlliance.trim().length === 0) {
        this.selectedAlliance = '';
        // this.initialize();
      }
    },
  },
  async mounted() {
    this.initialize();
  },
  methods: {
    meetFilterConditions(player) {
      return (
        player &&
        (this.minRank > 0 || this.maxRank > 0 || this.selectedAlliance) &&
        (this.minRank > 0 || this.maxRank > 0
          ? player.rank >= this.minRank && player.rank <= this.maxRank
          : true) &&
        (this.selectedAlliance
          ? player.allianceName === this.selectedAllianceName
          : true)
      );
    },
    async initialize(page = 1) {
      this.systems = [];
      // llamada asincrona de items
      let responses = await Promise.all([
        this.$store.dispatch(ENTITY + 'Module/list', {
          page,
          search: this.search,
          fieldsToSearch: this.fieldsToSearch,
          order: 1,
          sort: 'system',
          galaxy: this.selectedGalaxy,
          limit: 999999,
        }),
        planetsApi.getAlliances(),
      ]);
      this.alliances = responses[1].data.payload
        .filter((el) => el._id)
        .map((el) => ({
          _id: el._id,
          nameWithMembers: `${el.docs.highscorePositionAlliance}. ${el._id}, (${el.docs.alliancememberCount} miembros)`,
        }));
      console.log('🚀 Aqui *** -> this.alliances', this.alliances);
      // asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + 'Module'][ENTITY],
      );
      // dando formato adecuado a planetas (agrupado por sistemas)
      for (let i = 0; i < this[ENTITY].length; i += 1) {
        if (!this.systems[this[ENTITY][i].system - 1]) {
          this.systems[this[ENTITY][i].system - 1] = [];
        }
        this.systems[this[ENTITY][i].system - 1].push(this[ENTITY][i]);
      }
    },
    getRankClass(rankTitle) {
      return rankTitle === 'Señor de las estrellas'
        ? 'rank_starlord3'
        : rankTitle === 'Emperador'
        ? 'rank_starlord2'
        : rankTitle === 'Gran emperador'
        ? 'rank_starlord1'
        : rankTitle === 'Bandido'
        ? 'rank_bandit1'
        : rankTitle === 'Señor bandido'
        ? 'rank_bandit2'
        : rankTitle === 'Rey bandido'
        ? 'rank_bandit3'
        : '';
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
