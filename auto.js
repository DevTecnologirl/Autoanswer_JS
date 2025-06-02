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

const interval = setInterval(() => {
  const allButtons = deepQuerySelectorAll(document, "button");

  const acceptBtn = allButtons.find((btn) =>
    btn.textContent?.trim() === "Aceitar"
  );

  if (acceptBtn) {
    console.log("Botão encontrado e clicado:", acceptBtn);
    acceptBtn.click();
    clearInterval(interval);
  } else {
    console.log("Aguardando botão");
  }
}, 500); 

console.log("Iniciado autoanswer");
