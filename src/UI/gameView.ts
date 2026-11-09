import { isValidGuess, evaluateGuess, createInitialState, addGuessToState } from '../core/game.js';
import { saveRecord } from '../storage.js';

export function renderGameScreen(
  container: HTMLElement,
  base: number,
  length: number,
  secret: string,
  onNewGame: () => void,
): void {
  container.replaceChildren();

  let gameState = createInitialState(secret, length, base);

  const gameDiv = document.createElement('div');
  gameDiv.className = 'game';

  const scorePanel = document.createElement('div');
  scorePanel.className = 'game_score';

  const stepsSpan = document.createElement('span');
  stepsSpan.className = 'game_steps';
  stepsSpan.textContent = 'Steps: 0';

  const resultSpan = document.createElement('span');
  resultSpan.className = 'game_result';
  resultSpan.textContent = 'Bulls: 0 | Cows: 0';

  scorePanel.append(stepsSpan, resultSpan);

  const inputDiv = document.createElement('div');
  inputDiv.className = 'game_input-group';

  const guessInput = document.createElement('input');
  guessInput.className = 'game_input';
  guessInput.type = 'text';
  guessInput.placeholder = `Enter ${length} characters`;

  const guessBtn = document.createElement('button');
  guessBtn.className = 'game_guess-btn';
  guessBtn.textContent = 'Guess';

  inputDiv.append(guessInput, guessBtn);

  const historyList = document.createElement('ul');
  historyList.className = 'game_history';

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'game_new-btn';
  newGameBtn.textContent = 'New Game';

  gameDiv.append(scorePanel, inputDiv, historyList, newGameBtn);
  container.append(gameDiv);

  guessBtn.addEventListener('click', () => {
    const guess = guessInput.value;

    if (!isValidGuess(guess, length, base)) {
      alert(`Enter ${length} unique valid characters!`);
      return;
    }

    const evaluation = evaluateGuess(secret, guess);

    gameState = addGuessToState(gameState, guess, evaluation.bulls, evaluation.cows);

    stepsSpan.textContent = `Steps: ${gameState.history.length}`;
    resultSpan.textContent = `Bulls: ${evaluation.bulls} | Cows: ${evaluation.cows}`;

    const listItem = document.createElement('li');
    listItem.textContent = `${guess} — Bulls: ${evaluation.bulls}, Cows: ${evaluation.cows}`;
    historyList.append(listItem);

    guessInput.value = '';

    if (gameState.status === 'won') {
      alert('You won!');
      guessBtn.disabled = true;
      guessInput.disabled = true;

      const timeMs = (gameState.endTime ?? Date.now()) - gameState.startTime;
      saveRecord({
        base,
        length,
        steps: gameState.history.length,
        timeMs,
        date: new Date().toISOString(),
      });
    }
  });

  newGameBtn.addEventListener('click', onNewGame);
}
