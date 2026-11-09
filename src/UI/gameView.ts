import { isValidGuess, evaluateGuess, createInitialState, addGuessToState } from '../core/game.js';
import { saveRecord } from '../storage.js';
import { showModal } from './modal.js';

export function renderGameScreen(
  container: HTMLElement,
  base: number,
  length: number,
  secret: string,
  onNewGame: () => void,
): void {
  container.replaceChildren();

  let gameState = createInitialState(secret, length, base);
  let timerIntervalId: number | null = null;

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

  const timeSpentElement = document.createElement('span');
  timeSpentElement.className = 'game_time';
  timeSpentElement.textContent = 'Time: 00:00';

  scorePanel.append(stepsSpan, resultSpan, timeSpentElement);

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

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timerIntervalId !== null) clearInterval(timerIntervalId);

    timerIntervalId = window.setInterval(() => {
      const elapsedMs = Date.now() - gameState.startTime;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      timeSpentElement.textContent = `Time: ${formatTime(elapsedSeconds)}`;
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalId !== null) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }
  };

  startTimer();

  guessBtn.addEventListener('click', () => {
    const guess = guessInput.value;

    if (!isValidGuess(guess, length, base)) {
      showModal({
        title: 'Invalid Input',
        message: `Please enter ${length} unique valid characters.`,
        buttonText: 'OK',
        onClose: () => {
          guessInput.focus();
        },
      });
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
      const finalTimeMs = (gameState.endTime ?? Date.now()) - gameState.startTime;
      stopTimer();
      showModal({
        title: '🎉 You Won!',
        message: `You guessed the secret in ${gameState.history.length} steps and in ${formatTime(Math.floor(finalTimeMs / 1000))}`,
        buttonText: 'Play Again',
        onClose: onNewGame,
      });
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
