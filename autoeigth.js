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

  // Novo verificador: sobe pela árvore DOM, mesmo com Shadow Roots
  let current = btn;
  while (current) {
    if (current.tagName === 'SN-INBOX-CARD') return true;

    if (current.assignedSlot) {
      current = current.assignedSlot;
    } else if (current.parentNode) {
      current = current.parentNode;
    } else if (current.host) {
      current = current.host;
    } else {
      break;
    }
  }

  return false;
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

console.log("=== AutoAnswer iniciado ===");
