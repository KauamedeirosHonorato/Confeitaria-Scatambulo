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
    // Adiciona a validação quando o seletor é fechado (após digitar ou selecionar)
    onClose: function (selectedDates, dateStr, instance) {
      if (!dateStr) return; // Se não houver valor, não faz nada

      const noticeElement = document.getElementById("time-validation-notice");
      if (noticeElement) noticeElement.style.display = "none"; // Esconde o aviso por padrão

      const [hours, minutes] = dateStr.split(":").map(Number);

      // Validação para horários antes das 8:00
      if (hours < 8) {
        if (noticeElement) {
          noticeElement.textContent =
            "Nosso horário de entrega começa às 8:00. Ajustamos para você.";
          noticeElement.style.display = "block";
        }
        // Usa a API do flatpickr para definir a data/hora corretamente
        instance.setDate(`08:00`, true);
        return;
      }

      // Validação para horários depois das 18:00
      if (hours > 18 || (hours === 18 && minutes > 0)) {
        if (noticeElement) {
          noticeElement.textContent =
            "Nosso horário de entrega termina às 18:00. Ajustamos para você.";
          noticeElement.style.display = "block";
        }
        instance.setDate(`18:00`, true);
        return;
      }

      // Garante que o formato esteja sempre com dois dígitos (ex: 9:0 -> 09:00)
      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");
      instance.setDate(`${formattedHours}:${formattedMinutes}`, true);
    },
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