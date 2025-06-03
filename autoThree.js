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

function tryClickAcceptButtons(root = document) {
  const allButtons = deepQuerySelectorAll(root, "button");
  const acceptBtns = allButtons.filter(
    (btn) => btn.textContent?.trim() === "Aceitar" && !clickedButtons.has(btn)
  );

  acceptBtns.forEach((btn) => {
    console.log(" Botão encontrado e clicado:", btn);
    btn.click();
    clickedButtons.add(btn);
  });
}

// Observa o DOM e todos os Shadow DOMs
function observeDocumentAndShadows(root = document) {
  const observer = new MutationObserver(() => {
    tryClickAcceptButtons(root);
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
  });

  // Se houver shadowRoot, observa também
  const allElements = deepQuerySelectorAll(root, "*");
  allElements.forEach((el) => {
    if (el.shadowRoot) {
      observeDocumentAndShadows(el.shadowRoot);
    }
  });
}

// Inicialização
tryClickAcceptButtons(); // Tenta clicar nos já visíveis
observeDocumentAndShadows(); // Começa a observar

console.log(" AutoAnswer com observer iniciado.");
