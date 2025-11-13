document.addEventListener("DOMContentLoaded", function () {
  // Configuração para o seletor de data
  flatpickr("#data_entrega", {
    altInput: true,
    altFormat: "d/m/Y",
    dateFormat: "Y-m-d",
    minDate: "today",
    locale: {
      firstDayOfWeek: 0, // Domingo
      weekdays: {
        shorthand: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        longhand: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
      },
      months: {
        shorthand: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        longhand: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      },
    },
  });

  // Configuração para os seletores de hora
  const timePickerOptions = {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
  };

  flatpickr("#horario_inicio", timePickerOptions);
  flatpickr("#horario_fim", timePickerOptions);
});