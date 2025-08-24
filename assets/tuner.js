(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('tuner-toggle');
  const panel = document.getElementById('tuner');
  const closeBtn = document.getElementById('tuner-close');
  const saveBtn = document.getElementById('tuner-save');
  const resetBtn = document.getElementById('tuner-reset');

  const inputs = {
    frame: ['--frame', 'px', 'var-frame', 'out-frame'],
    container: ['--container', 'px', 'var-container', 'out-container'],
    columns: ['--columns', '', 'var-columns', 'out-columns'],
    gap: ['--gap', 'px', 'var-gap', 'out-gap'],
    headerLeft: ['--header-left', '%', 'var-header-left', 'out-header-left'],
    menuGap: ['--menu-gap', 'px', 'var-menu-gap', 'out-menu-gap'],
    font: ['--font-size', 'px', 'var-font', 'out-font'],
    track: ['--tracking', 'em', 'var-track', 'out-track']
  };

  const saved = JSON.parse(localStorage.getItem('designVars') || '{}');
  for (const key in inputs) {
    const [varName, unit, inputId, outId] = inputs[key];
    const input = document.getElementById(inputId);
    const out = document.getElementById(outId);
    const current = saved[varName] || getComputedStyle(root).getPropertyValue(varName).trim();
    const parsed = parseFloat(current);
    if (input) {
      input.value = isNaN(parsed) ? input.value : parsed;
      out.textContent = (parsed + (unit ? unit : ''));
      root.style.setProperty(varName, parsed + (unit || ''));
      input.addEventListener('input', () => {
        const val = input.value + (unit || '');
        root.style.setProperty(varName, val);
        out.textContent = val;
      });
    }
  }

  toggle && toggle.addEventListener('click', () => panel.hidden = !panel.hidden);
  closeBtn && closeBtn.addEventListener('click', () => panel.hidden = true);

  saveBtn && saveBtn.addEventListener('click', () => {
    const store = {};
    for (const key in inputs) {
      const [varName, unit, inputId] = inputs[key];
      const input = document.getElementById(inputId);
      if (input) store[varName] = input.value + (unit || '');
    }
    localStorage.setItem('designVars', JSON.stringify(store));
    panel.hidden = true;
  });

  resetBtn && resetBtn.addEventListener('click', () => {
    localStorage.removeItem('designVars');
    location.reload();
  });
})();