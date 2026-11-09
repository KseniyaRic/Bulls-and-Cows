export function showModal(options: { title: string; message: string; buttonText: string; onClose: () => void }): void {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const title = document.createElement('h2');
  title.className = 'modal__title';
  title.textContent = options.title;

  const message = document.createElement('p');
  message.className = 'modal__message';
  message.textContent = options.message;

  const button = document.createElement('button');
  button.className = 'modal__button';
  button.textContent = options.buttonText;

  modal.append(title, message, button);
  overlay.append(modal);
  document.body.append(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('modal-overlay--visible');
  });

  const closeModal = () => {
    overlay.classList.remove('modal-overlay--visible');
    setTimeout(() => {
      overlay.remove();
      options.onClose();
    }, 300);
  };

  button.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      document.removeEventListener('keydown', handleEscape);
      closeModal();
    }
  };
  document.addEventListener('keydown', handleEscape);
}
