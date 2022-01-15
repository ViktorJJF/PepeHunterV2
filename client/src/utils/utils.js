import { createToast } from 'mosha-vue-toastify';
import { es } from 'date-fns/locale';
import { format, isPast } from 'date-fns';
import store from '@/store';

export function formatDate(value) {
  return format(new Date(value), "d 'de' MMMM 'del' yyyy", {
    locale: es,
  });
}

const addCustomScript = (src) => {
  const recaptchaScript = document.createElement('script');
  recaptchaScript.setAttribute('src', src);
  recaptchaScript.async = true;
  document.head.appendChild(recaptchaScript);
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// const localesDateFns = {
//     en: require('date-fns/locale/en'),
//     es: require('date-fns/locale/es')
// }

const getFormat = (date, formatStr) => format(date, formatStr);

const formatErrorMessages = (translationParent, msg) => {
  const errorArray = [];
  // Check for error msgs
  if (msg !== null) {
    const json = JSON.parse(JSON.stringify(msg));
    // If error message is an array, then we have mutiple errors
    if (Array.isArray(json)) {
      json.map((error) => errorArray.push(`${error.msg}`));
    } else {
      // Single error
      errorArray.push(`${msg}`);
    }
    return errorArray;
  }
  // all good, return null
  return null;
};

const buildPayloadPagination = (pagination, search) => {
  const { page, itemsPerPage } = pagination;
  let { sortDesc, sortBy } = pagination;

  // When sorting you always get both values
  if (sortBy && sortDesc) {
    if (sortBy.length === 1 && sortDesc.length === 1) {
      // Gets order
      sortDesc = sortDesc[0] === true ? -1 : 1;
      // Gets column to sort on
      sortBy = sortBy ? sortBy[0] : '';
    }
  }
  let query = {};

  // If search and fields are defined
  if (search) {
    query = {
      sort: sortBy,
      order: sortDesc,
      page,
      limit: itemsPerPage,
      filter: search.query,
      fields: search.fields,
    };
  } else if (sortBy && sortDesc) {
    // Pagination with no filters
    query = {
      sort: sortBy,
      order: sortDesc,
      page,
      limit: itemsPerPage,
    };
  } else {
    query = {
      page,
      limit: itemsPerPage,
    };
  }
  return query;
};

const buildQueryWithPagination = (query) => {
  let queryWithPagination = {};
  if (query && query.page) {
    const { page, search, fieldsToSearch } = query;
    queryWithPagination = buildPayloadPagination(
      {
        page,
        itemsPerPage: store.state.itemsPerPage,
      },
      search ? { query: search, fields: fieldsToSearch.join(',') } : {},
    );
    delete query['page'];
    delete query['fieldsToSearch'];
    delete query['search'];
  }
  return { ...queryWithPagination, ...query };
};

// Catches error connection or any other error (checks if error.response exists)
const handleError = (error, commit, reject) => {
  let errMsg = '';
  // Resets errors in store
  commit('loadingModule/showLoading', false, { root: true });
  console.log('sucedio un error....');
  console.log('el error: ', error);
  // Checks if unauthorized
  if (!error.response) {
    commit('errorModule/error', 'La solicitud tardó mucho tiempo...', {
      root: true,
    });
    return reject(error);
  }
  if (error.response.status === 401) {
    store.dispatch('authModule/logout', { root: true });
    console.log('se fue al loign');
  } else {
    console.log('se produjo else');
    // Any other error
    errMsg = error.response
      ? error.response.data.errors.msg
      : 'SERVER_TIMEOUT_CONNECTION_ERROR';
    // setTimeout(
    //   () =>
    //     errMsg
    //       ? commit('errorModule/error', errMsg, { root: true })
    //       : commit('errorModule/showError', false, { root: true }),
    //   0,
    // );
    createToast(errMsg, { timeout: 3000, type: 'danger' });
  }
  reject(error);
  return 0;
};

const buildSuccess = (msg) => {
  createToast(msg, { timeout: 3000, type: 'success' });
};

// Checks if tokenExpiration in localstorage date is past, if so then trigger an update
const checkIfTokenNeedsRefresh = () => {
  // Checks if time set in localstorage is past to check for refresh token
  if (
    window.localStorage.getItem('token') !== null &&
    window.localStorage.getItem('tokenExpiration') !== null
  ) {
    if (
      isPast(
        new Date(
          JSON.parse(window.localStorage.getItem('tokenExpiration')) * 1000,
        ),
      )
    ) {
      store.dispatch('refreshToken');
    }
  }
};

function searchItem(search, items, fieldsToSearch) {
  return search && search.trim().length > 0
    ? items.filter((item) =>
        fieldsToSearch.some(
          (key) =>
            (typeof item[key] === 'string' || typeof item[key] === 'number') &&
            String(item[key])
              .toLowerCase()
              .includes(search.toLowerCase().trim()),
        ),
      )
    : items;
}
export {
  addCustomScript,
  getRandomInt,
  getFormat,
  formatErrorMessages,
  buildPayloadPagination,
  buildQueryWithPagination,
  handleError,
  buildSuccess,
  checkIfTokenNeedsRefresh,
  searchItem,
};
