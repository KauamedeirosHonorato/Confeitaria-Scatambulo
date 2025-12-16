document.addEventListener("DOMContentLoaded", function () {
  // --- 1. Lógica de Data Mínima ---
  const now = new Date();
  let minDateForPicker = "today";

  // Se passar das 18h, o pedido mínimo é para o dia seguinte
  if (now.getHours() >= 18) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    minDateForPicker = tomorrow;
  }

  // --- 2. Configuração dos Seletores de Hora (Início e Fim) ---
  const timePickerOptions = {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minTime: "08:00",
    maxTime: "18:00",
    // Validação ao fechar o relógio
    onClose: function (selectedDates, dateStr, instance) {
      if (!dateStr) return; // Se não houver valor, não faz nada

      const noticeElement = document.getElementById("time-validation-notice");
      const noticeMsg = document.getElementById("time-validation-msg");

      // Reseta aviso (Oculta usando a classe do Tailwind)
      if (noticeElement) noticeElement.classList.add("hidden");

      const [hours, minutes] = dateStr.split(":").map(Number);

      // Validação para horários antes das 8:00
      if (hours < 8) {
        if (noticeElement && noticeMsg) {
          noticeMsg.textContent =
            "Nosso horário de entrega começa às 8:00. Ajustamos para você.";
          noticeElement.classList.remove("hidden");
        }
        // Usa a API do flatpickr para definir a data/hora corretamente
        instance.setDate(`08:00`, true);
        return;
      }

      // Validação para horários depois das 18:00
      if (hours > 18 || (hours === 18 && minutes > 0)) {
        if (noticeElement && noticeMsg) {
          noticeMsg.textContent =
            "Nosso horário de entrega termina às 18:00. Ajustamos para você.";
          noticeElement.classList.remove("hidden");
        }
        instance.setDate(`18:00`, true);
        return;
      }

      // Formata para garantir dois dígitos visualmente (ex: 09:00)
      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");
      // Apenas atualiza se mudou a formatação para evitar loops
      if (dateStr !== `${formattedHours}:${formattedMinutes}`) {
        instance.setDate(`${formattedHours}:${formattedMinutes}`, true);
      }

      // Validação Específica para Domingo (> 12:00)
      const dataInput = document.getElementById("data_entrega");
      // Verifica se o input de data tem uma instância do flatpickr carregada
      if (dataInput && dataInput._flatpickr) {
        const dateInstance = dataInput._flatpickr;

        if (dateInstance.selectedDates.length > 0) {
          const selectedDate = dateInstance.selectedDates[0];
          // Se tiver data selecionada e for Domingo (0)
          if (selectedDate && selectedDate.getDay() === 0) {
            if (hours > 12 || (hours === 12 && minutes > 0)) {
              if (noticeElement && noticeMsg) {
                noticeMsg.textContent =
                  "Aos domingos entregamos apenas até 12:00.";
                noticeElement.classList.remove("hidden");
              }
              instance.setDate("12:00", true);
            }
          }
        }
      }

      // Dispara o evento 'change' para garantir que o carrinho.js valide o horário e exiba a mensagem "Fechamos às 12:00" se necessário
      instance.element.dispatchEvent(new Event('change', { bubbles: true }));
    },
  };

  const timePickerInicio = flatpickr("#horario_inicio", timePickerOptions);
  const timePickerFim = flatpickr("#horario_fim", timePickerOptions);

  // --- 3. Configuração do Seletor de Data ---
  const datePicker = flatpickr("#data_entrega", {
    altInput: true,
    altFormat: "d/m/Y",
    dateFormat: "Y-m-d",
    minDate: minDateForPicker,
    // Configuração manual de Locale conforme solicitado
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
      "2025-12-25",
      "2026-01-01"
    ],
    onChange: function (selectedDates, dateStr, instance) {
      const selectedDate = selectedDates[0];
      if (!selectedDate) return;

      const dayOfWeek = selectedDate.getDay(); // 0 para Domingo, 6 para Sábado

      const saturdayDeliveryNotice = document.getElementById(
        "saturday-delivery-notice"
      );
      const sundayDeliveryNotice = document.getElementById(
        "sunday-delivery-notice"
      );
      const deliveryTimeInfo = document.getElementById("delivery-time-info");
      const timeNotice = document.getElementById("time-validation-notice");

      // Resetar visibilidade dos avisos e limites de horário
      if (saturdayDeliveryNotice)
        saturdayDeliveryNotice.classList.add("hidden");
      if (sundayDeliveryNotice) sundayDeliveryNotice.classList.add("hidden");
      if (timeNotice) timeNotice.classList.add("hidden");

      // Volta o limite padrão para 18:00
      timePickerInicio.set("maxTime", "18:00");
      timePickerFim.set("maxTime", "18:00");

      // Reseta o texto do horário para o padrão
      if (deliveryTimeInfo) {
        const span = deliveryTimeInfo.querySelector("span") || deliveryTimeInfo;
        span.innerHTML =
          "Nosso horário de entregas é das <strong>08:00 às 18:00</strong>.";
      }

      if (dayOfWeek === 0) {
        // Domingo
        timePickerInicio.set("maxTime", "12:00");
        timePickerFim.set("maxTime", "12:00");

        if (sundayDeliveryNotice)
          sundayDeliveryNotice.classList.remove("hidden");

        // Atualiza o texto informativo do horário para domingo
        if (deliveryTimeInfo) {
          const span =
            deliveryTimeInfo.querySelector("span") || deliveryTimeInfo;
          span.innerHTML =
            "Domingo entregamos das <strong>08:00 às 12:00</strong>.";
        }

        // Define horário padrão para Domingo: 08:00 às 12:00
        timePickerInicio.setDate("08:00", true);
        timePickerFim.setDate("12:00", true);
      } else if (dayOfWeek === 6) {
        // Sábado - Exibe o aviso de sábado
        if (saturdayDeliveryNotice)
          saturdayDeliveryNotice.classList.remove("hidden");
      }

      // DISPARA O EVENTO 'CHANGE' MANUALMENTE PARA O CARRINHO.JS DETECTAR A MUDANÇA
      instance.element.dispatchEvent(new Event('change', { bubbles: true }));
    },
  });
});
