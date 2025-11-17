document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  let minDateForPicker = "today";
  // Se passar das 18h, o pedido mínimo é para o dia seguinte.
  if (now.getHours() >= 18) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    minDateForPicker = tomorrow;
  }

  // Configuração para os seletores de hora
  const timePickerOptions = {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minTime: "08:00",
    maxTime: "18:00",
  };

  const timePickerInicio = flatpickr("#horario_inicio", timePickerOptions);
  const timePickerFim = flatpickr("#horario_fim", timePickerOptions);

  // Configuração para o seletor de data
  const datePicker = flatpickr("#data_entrega", {
    altInput: true,
    altFormat: "d/m/Y",
    dateFormat: "Y-m-d",
    minDate: minDateForPicker,
    locale: {
      firstDayOfWeek: 0, // Domingo
      weekdays: {
        shorthand: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        longhand: [
          "Domingo",
          "Segunda-feira",
          "Terça-feira",
          "Quarta-feira",
          "Quinta-feira",
          "Sexta-feira",
          "Sábado",
        ],
      },
      months: {
        shorthand: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ],
        longhand: [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ],
      },
    },
    disable: [
      function (date) {
        // Desabilitar domingos
        return date.getDay() === 0;
      },
    ],
    onChange: function (selectedDates, dateStr, instance) {
      const selectedDate = selectedDates[0];
      if (!selectedDate) return;

      const dayOfWeek = selectedDate.getDay();
      const saturdayDeliveryNotice = document.getElementById(
        "saturday-delivery-notice"
      );

      // Habilita/desabilita o aviso de entrega no domingo
      if (dayOfWeek === 6) {
        // Sábado
        saturdayDeliveryNotice.style.display = "block";
      } else {
        saturdayDeliveryNotice.style.display = "none";
      }
    },
  });
});