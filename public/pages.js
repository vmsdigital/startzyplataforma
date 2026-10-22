(() => {
  'use strict';
  const filters = Array.from(document.querySelectorAll('[data-project-filter]'));
  const projects = Array.from(document.querySelectorAll('[data-project-category]'));
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.projectFilter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    projects.forEach(item => {
      const visible = category === 'todos' || item.dataset.projectCategory === category;
      item.hidden = !visible;
      if (visible) count++;
    });
    const label = document.getElementById('project-count');
    if (label) label.textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
  }));

  const form = document.getElementById('project-form');
  if (form) {
    const selector = form.elements.namedItem('interesse');
    const params = new URLSearchParams(location.search);
    const requested = params.get('servico') || params.get('service');
    if (requested) {
      const aliases = {Sistemas: 'sistemas', Sistema: 'sistemas', Automação: 'automacao', 'Inteligência artificial': 'ia'};
      const value = aliases[requested] || requested;
      if (Array.from(selector.options).some(option => option.value === value)) selector.value = value;
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = form.elements.namedItem('nome');
      const message = form.elements.namedItem('mensagem');
      name.setCustomValidity(name.value.trim() ? '' : 'Conte seu nome para começarmos a conversa.');
      message.setCustomValidity(message.value.trim().length >= 10 ? '' : 'Conte um pouco mais da sua ideia (ao menos 10 caracteres).');
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const value = key => String(data.get(key) || '').trim();
      const interest = selector.options[selector.selectedIndex].text;
      const lines = [`Oi, Startzy! Meu nome é ${value('nome')}.`];
      if (value('empresa')) lines.push(`Empresa: ${value('empresa')}.`);
      if (value('cidade')) lines.push(`Cidade/estado: ${value('cidade')}.`);
      lines.push(`Interesse: ${interest}.`, '', value('mensagem'));
      if (value('prazo')) lines.push('', `Data ou contexto: ${value('prazo')}.`);
      const text = lines.join('\n');
      document.getElementById('message-preview').value = text;
      document.getElementById('message-whatsapp').href = `https://wa.me/5511997513044?text=${encodeURIComponent(text)}`;
      const result = document.getElementById('message-result');
      result.hidden = false;
      document.getElementById('contact-status').textContent = 'Confira a mensagem. Ao abrir o WhatsApp, você decide quando enviar.';
      result.scrollIntoView({behavior: document.documentElement.classList.contains('reduce-motion') ? 'auto' : 'smooth', block: 'nearest'});
    });
    ['nome', 'mensagem'].forEach(key => form.elements.namedItem(key).addEventListener('input', event => event.target.setCustomValidity('')));
  }

  const project = document.getElementById('calc-project');
  const monthly = document.getElementById('calc-monthly');
  if (project && monthly) {
    const currency = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
    const number = input => {
      const raw = Number(input.value);
      const max = Number(input.max);
      return Number.isFinite(raw) ? Math.max(0, Math.min(raw, max)) : 0;
    };
    const round = amount => Math.round((amount + Number.EPSILON) * 100) / 100;
    const calculate = () => {
      const base = round(number(project) * .30);
      const first = round(number(monthly) * .50);
      const second = round(number(monthly) * .35);
      document.getElementById('commission-project').textContent = currency.format(base);
      document.getElementById('commission-first').textContent = currency.format(first);
      document.getElementById('commission-second').textContent = currency.format(second);
      document.getElementById('commission-total').textContent = currency.format(round(base + first + second));
    };
    project.addEventListener('input', calculate);
    monthly.addEventListener('input', calculate);
    calculate();
  }
})();
