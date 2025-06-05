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
  const textIsAccept = btn.textContent?.trim() === "Aceitar";
  if (!textIsAccept) return false;

  const isInNotification = btn.closest('.now-button') !== null;

  return isInNotification;
}

function tryClickAcceptButtons(root = document) {
  const allButtons = deepQuerySelectorAll(root, "button");

  const acceptBtns = allButtons.filter((btn) => {
    return isTargetAcceptButton(btn) && !clickedButtons.has(btn);
  });

  acceptBtns.forEach((btn) => {
    console.log("Botão 'Aceitar' da notificação encontrado e clicado:", btn);
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

console.log("AutoAnswer iniciado com filtro específico para notificações.");
