//Verificar seletor: 
[...document.querySelectorAll("*")].filter(el => el.tagName.toLowerCase().includes("now"))

 
//Ver o que chega via websocket:
const obs = new MutationObserver((mutations) => {

  mutations.forEach((mutation) => {

    mutation.addedNodes.forEach((node) => {

      if (node.nodeType === 1) {

        console.log("Novo elemento adicionado:", node.tagName, node);

      }

    });

  });

});
 
obs.observe(document.body, {

  childList: true,

  subtree: true,

});

 

 
