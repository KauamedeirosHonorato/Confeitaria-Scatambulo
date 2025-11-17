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
    // Remove a função que desabilitava domingos
    // disable: [
    //   function (date) {
    //     return date.getDay() === 0;
    //   },
    // ],
    onChange: function (selectedDates, dateStr, instance) {
      const selectedDate = selectedDates[0];
      if (!selectedDate) return;

      const dayOfWeek = selectedDate.getDay(); // 0 para Domingo, 6 para Sábado
      const sundayDeliveryNotice = document.getElementById(
        "sunday-delivery-notice"
      );

      // Resetar maxTime para o padrão (18:00)
      timePickerInicio.set("maxTime", "18:00");
      timePickerFim.set("maxTime", "18:00");
      if (sundayDeliveryNotice) sundayDeliveryNotice.style.display = "none";

      if (dayOfWeek === 0) {
        // Domingo
        timePickerInicio.set("maxTime", "12:00");
        timePickerFim.set("maxTime", "12:00");
        if (sundayDeliveryNotice) sundayDeliveryNotice.style.display = "block";

        // Ajustar horários se já estiverem definidos e forem após 12:00
        const currentInicio = timePickerInicio.selectedDates[0];
        const currentFim = timePickerFim.selectedDates[0];

        if (currentInicio && (currentInicio.getHours() > 12 || (currentInicio.getHours() === 12 && currentInicio.getMinutes() > 0))) {
          timePickerInicio.setDate("12:00", true);
        }
        if (currentFim && (currentFim.getHours() > 12 || (currentFim.getHours() === 12 && currentFim.getMinutes() > 0))) {
          timePickerFim.setDate("12:00", true);
        }
      } else if (dayOfWeek === 6) {
        // Sábado - manter o aviso original se houver
        // A lógica para sábado pode ser adicionada aqui se necessário,
        // mas o aviso de "Bolos pedidos no sábado serão entregues no domingo até as 12:00"
        // foi substituído por um aviso geral de domingo.
        // Se houver um aviso específico para sábado, ele deve ter um ID diferente.
        // Por enquanto, apenas garantimos que o aviso de domingo não apareça.
      }
    },
  });
});