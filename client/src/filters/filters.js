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
    formatDateWithHour(value) {
      try {
        const formattedValue = new Date(value) || value;
        return format(
          new Date(formattedValue),
          "d 'de' MMMM 'del' yyyy 'a las' hh:mm:ss aaa",
          {
            locale: es,
          },
        );
      } catch (error) {
        return 'Fecha inválida';
      }
    },
    formatHour(value) {
      try {
        const formattedValue = new Date(value) || value;
        return format(new Date(formattedValue), 'hh:mm:ss', {
          locale: es,
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    },
    formatHourHeader(value) {
      try {
        const formattedValue = new Date(value) || value;
        return format(new Date(formattedValue), 'hh:mm:ss a', {
          locale: es,
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    },
  };
}
