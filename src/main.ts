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
