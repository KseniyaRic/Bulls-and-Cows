import '../style.css';

const app = document.createElement('div');
app.id = 'app';

const header = document.createElement('header');
header.className = 'header';

const titleContainer = document.createElement('div');
titleContainer.className = 'header_title-container';

const leftImg = document.createElement('img');
leftImg.src = '/public/pic/bull.svg';
leftImg.alt = 'Bull';
leftImg.className = 'header_icon';

const title = document.createElement('h1');
title.textContent = 'Bulls and Cows';
title.className = 'header_text';

const rightImg = document.createElement('img');
rightImg.src = '/public/pic/cow.svg';
rightImg.alt = 'Cow';
rightImg.className = 'header_icon';

titleContainer.append(leftImg, title, rightImg);
header.append(titleContainer);

const main = document.createElement('main');
main.className = 'main';

app.append(header, main);
document.body.append(app);

function clearMain(): void {
  main.replaceChildren();
}

function createBaseSelect(): HTMLSelectElement {
  const select = document.createElement('select');
  select.className = 'settings_select';
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
    select.append(baseOption);
  });
  return select;
}

function createLengthSelect(): HTMLSelectElement {
  const select = document.createElement('select');
  select.className = 'settings_select';
  for (let length = 2; length <= 6; length++) {
    const lengthOption = document.createElement('option');
    lengthOption.value = String(length);
    lengthOption.textContent = `Length: ${length}`;
    if (length === 4) lengthOption.selected = true;
    select.append(lengthOption);
  }
  return select;
}

function renderSettingsScreen(): void {
  clearMain();

  const settingsDiv = document.createElement('div');
  settingsDiv.className = 'settings';

  const baseSelect = createBaseSelect();
  const lengthSelect = createLengthSelect();

  const secretInput = document.createElement('input');
  secretInput.className = 'settings_input';
  secretInput.type = 'text';
  secretInput.placeholder = 'Enter secret number';

  const startBtn = document.createElement('button');
  startBtn.className = 'settings_start-btn';
  startBtn.textContent = 'Start';

  settingsDiv.append(baseSelect, lengthSelect, secretInput, startBtn);

  main.append(settingsDiv);
}

renderSettingsScreen();
