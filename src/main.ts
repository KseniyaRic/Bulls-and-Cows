import '../style.css';
import { renderSettingsScreen } from './UI/settings.js';
import { renderGameScreen } from './UI/gameView.js';
import { generateSecret } from './core/game.js';

const app = document.createElement('div');
app.id = 'app';

const header = document.createElement('header');
header.className = 'header';

const titleContainer = document.createElement('div');
titleContainer.className = 'header_title-container';

const leftImg = document.createElement('img');
leftImg.src = './pic/bull.svg';
leftImg.alt = 'Bull';
leftImg.className = 'header_icon';

const title = document.createElement('h1');
title.textContent = 'Bulls and Cows';
title.className = 'header_text';

const rightImg = document.createElement('img');
rightImg.src = './pic/cow.svg';
rightImg.alt = 'Cow';
rightImg.className = 'header_icon';

titleContainer.append(leftImg, title, rightImg);
header.append(titleContainer);

const main = document.createElement('main');
main.className = 'main';

app.append(header, main);
document.body.append(app);

function showSettings(): void {
  renderSettingsScreen(main, (base, length) => {
    const secret = generateSecret(length, base);
    showGame(base, length, secret);
  });
}

function showGame(base: number, length: number, secret: string): void {
  renderGameScreen(main, base, length, secret, showSettings);
}

showSettings();
