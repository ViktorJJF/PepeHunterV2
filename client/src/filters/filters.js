import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function initialize(app) {
  app.config.globalProperties.$filters = {
    formatDate(value) {
      try {
        const formattedValue = new Date(value) || value;
        return format(new Date(formattedValue), "d 'de' MMMM 'del' yyyy", {
          locale: es,
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    },
  };
}
