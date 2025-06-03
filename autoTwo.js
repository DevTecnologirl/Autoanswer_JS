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

const interval = setInterval(() => {
  const allButtons = deepQuerySelectorAll(document, "button");
  const acceptBtns = allButtons.filter(
    (btn) => btn.textContent?.trim() === "Aceitar" && !clickedButtons.has(btn)
  );

  acceptBtns.forEach((btn) => {
    console.log("==== Botão encontrado e clicado: ====", btn);
    btn.click();
    clickedButtons.add(btn);
  });

  if (acceptBtns.length === 0) {
    console.log("======= Aguardando botão =========");
  }
}, 500);

console.log("======== AutoAnswer iniciado ======");
