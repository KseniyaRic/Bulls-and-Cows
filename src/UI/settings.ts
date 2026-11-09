import { loadRecords } from '../storage.js';

export function renderSettingsScreen(container: HTMLElement, onStart: (base: number, length: number) => void): void {
  container.replaceChildren();

  const settingsDiv = document.createElement('div');
  settingsDiv.className = 'settings';

  const baseSelect = document.createElement('select');
  baseSelect.className = 'settings_select';
  const bases = [
    { value: 2, label: 'Binary (2)' },
    { value: 8, label: 'Octal (8)' },
    { value: 10, label: 'Decimal (10)' },
    { value: 16, label: 'Hex (16)' },
  ];
  bases.forEach((base) => {
    const baseOption = document.createElement('option');
    baseOption.value = String(base.value);
    baseOption.textContent = base.label;
    if (base.value === 10) baseOption.selected = true;
    baseSelect.append(baseOption);
  });

  const lengthSelect = document.createElement('select');
  lengthSelect.className = 'settings_select';
  for (let length = 2; length <= 6; length++) {
    const lengthOption = document.createElement('option');
    lengthOption.value = String(length);
    lengthOption.textContent = `Length: ${length}`;
    if (length === 4) lengthOption.selected = true;
    lengthSelect.append(lengthOption);
  }

  const startBtn = document.createElement('button');
  startBtn.className = 'settings_start-btn';
  startBtn.textContent = 'Start';

  settingsDiv.append(baseSelect, lengthSelect, startBtn);
  container.append(settingsDiv);

  const recordsDiv = document.createElement('div');
  recordsDiv.className = 'settings_records';

  const recordsTitle = document.createElement('h3');
  recordsTitle.textContent = 'Best Results';
  recordsDiv.append(recordsTitle);

  const records = loadRecords().filter(
    (rec) => rec.base === Number(baseSelect.value) && rec.length === Number(lengthSelect.value),
  );

  if (records.length === 0) {
    const emptyText = document.createElement('p');
    emptyText.textContent = 'No records yet';
    recordsDiv.append(emptyText);
  } else {
    const list = document.createElement('ul');

    records.slice(0, 3).forEach((rec) => {
      const li = document.createElement('li');
      const timeSec = (rec.timeMs / 1000).toFixed(1);
      li.textContent = `Base ${rec.base}, Len ${rec.length}: ${rec.steps} steps, ${timeSec}s`;
      list.append(li);
    });

    recordsDiv.append(list);
  }
  settingsDiv.append(recordsDiv);

  const updateRecords = () => {
    recordsDiv.replaceChildren();

    const title = document.createElement('h3');
    title.textContent = 'Best Results';
    recordsDiv.append(title);

    const records = loadRecords().filter(
      (rec) => rec.base === Number(baseSelect.value) && rec.length === Number(lengthSelect.value),
    );

    if (records.length === 0) {
      const emptyText = document.createElement('p');
      emptyText.textContent = 'No records yet';
      recordsDiv.append(emptyText);
    } else {
      const list = document.createElement('ul');
      records.slice(0, 3).forEach((rec) => {
        const li = document.createElement('li');
        const timeSec = (rec.timeMs / 1000).toFixed(1);
        li.textContent = `Base ${rec.base}, Len ${rec.length}: ${rec.steps} steps, ${timeSec}s`;
        list.append(li);
      });
      recordsDiv.append(list);
    }
  };

  const updateLengthOptions = () => {
    const currentBase = Number(baseSelect.value);
    Array.from(lengthSelect.options).forEach((option) => {
      option.disabled = currentBase === 2 && option.value !== '2';
    });
    if (currentBase === 2) {
      lengthSelect.value = '2';
    }
  };

  baseSelect.addEventListener('change', () => {
    updateLengthOptions();
    updateRecords();
  });

  lengthSelect.addEventListener('change', () => {
    updateLengthOptions();
    updateRecords();
  });

  startBtn.addEventListener('click', () => {
    const base = Number(baseSelect.value);
    const length = Number(lengthSelect.value);
    onStart(base, length);
  });

  updateLengthOptions();
  updateRecords();
}
