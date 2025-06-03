function deepQuerySelectorAll(node = document, selector = "button") {
  let elements = [];

  // Pega do próprio shadowRoot (se existir)
  if (node.shadowRoot) {
    elements = elements.concat(deepQuerySelectorAll(node.shadowRoot, selector));
  }

  // Pega os elementos que combinam no escopo atual
  if (node.querySelectorAll) {
    elements = elements.concat(Array.from(node.querySelectorAll(selector)));
  }

  // Percorre recursivamente os filhos (inclusive se tiverem shadowRoot)
  node.childNodes?.forEach((child) => {
    elements = elements.concat(deepQuerySelectorAll(child, selector));
  });

  return elements;
}

const clickedButtons = new WeakSet();

function tryClickAcceptButtons(root = document) {
  const allButtons = deepQuerySelectorAll(root, "button");
  const acceptBtns = allButtons.filter(
    (btn) => btn.textContent?.trim() === "Aceitar" && !clickedButtons.has(btn)
  );

  acceptBtns.forEach((btn) => {
    console.log(" Botão 'Aceitar' encontrado e clicado:", btn);
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

    // Para cada novo elemento, verifica se tem shadowRoot e observa
    deepQuerySelectorAll(root, "*").forEach((el) => {
      if (el.shadowRoot) {
        observeDocumentAndShadows(el.shadowRoot);
      }
    });
  });

  observer.observe(root, { childList: true, subtree: true });

  // Também observa qualquer shadowRoot já existente
  deepQuerySelectorAll(root, "*").forEach((el) => {
    if (el.shadowRoot) {
      observeDocumentAndShadows(el.shadowRoot);
    }
  });
}

// Inicialização
tryClickAcceptButtons();
observeDocumentAndShadows();

console.log(" AutoAnswer com observer iniciado.");
