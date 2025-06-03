🧩 O que é Shadow Root?
O Shadow Root é parte da tecnologia chamada Shadow DOM, usada para criar componentes encapsulados no HTML.

💡 Em resumo:
É um DOM invisível (isolado) que fica dentro de um elemento HTML, criado por bibliotecas ou frameworks (como Web Components, Stencil, Lit, etc).
O conteúdo do Shadow DOM não é acessível diretamente com document.querySelector().
Ele permite que o estilo e o comportamento fiquem isolados — ou seja, CSS externo não afeta ele, e o JS tradicional não enxerga os elementos internos normalmente.

<custom-button></custom-button>
Esse custom-button pode ter internamente:
html
#shadow-root (open)
  <button class="btn">Clique aqui</button>
Mas você não vê esse conteúdo no HTML direto, só pelo DevTools (F12). E se tentar fazer:

js
document.querySelector('custom-button .btn'); // ❌ Não funciona
...o botão não será encontrado, pois está "protegido" dentro do Shadow DOM.


🛠 Como acessar elementos dentro do Shadow Root?
Se o shadowRoot estiver aberto (mode: 'open'), você pode acessar com JavaScript assim:

js
const custom = document.querySelector('custom-button');
const shadow = custom.shadowRoot; // Aqui você entra no Shadow DOM
const btn = shadow.querySelector('.btn'); // Agora você acessa o botão

🧠 Dica extra:
Se o shadowRoot estiver closed (oculto), não dá pra acessar via JS, só o código interno do componente consegue.
