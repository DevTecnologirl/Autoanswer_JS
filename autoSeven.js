function deepQuerySelectorAll(node = document, selector = "button") {
  let elements = [];

  if (node.shadowRoot) {
    elements = elements.concat(deepQuerySelectorAll(node.shadowRoot, selector));
  }

  if (node.querySelectorAll) {
    elements = elements.concat(Array.from(node.querySelectorAll(selector)));
  }

  node.childNodes?.forEach((child) => {
    elements = elements.concat(deepQuerySelectorAll(child, selector));
  });

  return elements;
}

const clickedButtons = new WeakSet();

function isTargetAcceptButton(btn) {
  if (btn.textContent?.trim() !== "Aceitar") return false;

  const snInboxCard = btn.closest('sn-inbox-card');
  if (!snInboxCard) return false;

  const nowCard = btn.closest('now-card');
  if (!nowCard || !snInboxCard.contains(nowCard)) return false;

  const nowCardActions = btn.closest('now-card-actions');
  if (!nowCardActions || !nowCard.contains(nowCardActions)) return false;

  const nowButton = btn.closest('now-button');
  if (!nowButton || !nowCardActions.contains(nowButton)) return false;

  return true;
}

function tryClickAcceptButtons(root = document) {
  const allButtons = deepQuerySelectorAll(root, "button");

  const acceptBtns = allButtons.filter((btn) => {
    return isTargetAcceptButton(btn) && !clickedButtons.has(btn);
  });

  acceptBtns.forEach((btn) => {
    console.log("✅ Botão 'Aceitar' da notificação clicado:", btn);
    btn.click();
    clickedButtons.add(btn);
  });
}

const observedRoots = new WeakSet();

function observeDocumentAndShadows(root = document) {
  if (observedRoots.has(root)) return;
  observedRoots.add(root);

  const observer = new MutationObserver(() => {
    tryClickAcceptButtons(root);

    deepQuerySelectorAll(root, "*").forEach((el) => {
      if (el.shadowRoot) {
        observeDocumentAndShadows(el.shadowRoot);
      }
    });
  });

  observer.observe(root, { childList: true, subtree: true });

  deepQuerySelectorAll(root, "*").forEach((el) => {
    if (el.shadowRoot) {
      observeDocumentAndShadows(el.shadowRoot);
    }
  });
}

tryClickAcceptButtons();
observeDocumentAndShadows();

console.log("✅ AutoAnswer com filtro específico para o botão 'Aceitar' dentro da notificação.");
