/* DOM */
const elementoTexto = document.getElementById('texto');
const optionButtonsElement = document.getElementById('option-buttons');
const inventarioHTML = document.getElementById('inventarioHTML');

/* Chart de Stats */
const canvas = "<canvas class='myChart' width='10px' height='10px'></canvas>";
let chart = document.querySelector('.myChart');
const ctx = document.querySelector('.myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Puntos de Vida', 'Muerte', 'Energía', 'Hambre'],
        datasets: [{
            label: '# of Votes',
            data: [50, 0, 45, 5], /* start values */
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(0, 0, 0, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            radius:100,
            
            borderWidth: 1,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

/* Mapa */
const botonMapa = document.querySelector("#map");
const contenedorFetch = document.querySelector("#fetch");
const obtenerFetch = ()=>{
  fetch("./datos.json")
    .then(response => response.json())
    .then(result => {
      result.forEach (datos => {
        contenedorFetch.innerHTML = "";
        contenedorFetch.innerHTML += `
          <div class="map"> 
            <img src="${datos.mapa}"></img>
          </div>
        `;
      });
    })
};
botonMapa.onclick = ()=>{
  obtenerFetch();
};


let inventario = {};

function startGame() {
  inventario = {}
  mostrarNodoTexto(1)
}

/* Modificar stats */
function modifyStats(stats) {
  chart.remove();
  document.querySelector(".anchor").insertAdjacentHTML('afterend', canvas);
  chart = document.querySelector('.myChart');
  new Chart(chart, {
    type: 'doughnut',
    data: {
        labels: ['Puntos de Vida', 'Muerte', 'Energía', 'Hambre'],
        datasets: [{
            label: '# of Votes',
            data: stats,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(0, 0, 0, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            radius:100,
            
            borderWidth: 1,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

/* Funciones de eventos */
function mostrarNodoTexto(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  elementoTexto.innerText = textNode.text
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }
  
  textNode.options.forEach(option => {
    if (mostrarOpciones(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')
      button.addEventListener('click', () => seleccionarOpcion(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

function mostrarOpciones(option) {
  return option.requiredInventario == null || option.requiredInventario(inventario)
}

function seleccionarOpcion(option) {
  if (option.stats) {
    modifyStats(option.stats);
  }
  const nextTextNodeId = option.nextText;
  if (nextTextNodeId <= 0) {
    return startGame();
  }
  inventario = Object.assign(inventario, option.setInventario);
  mostrarNodoTexto(nextTextNodeId);
  let inventarioString = JSON.stringify(inventario);
  localStorage.setItem("inventario", JSON.stringify(inventario));
  console.log(localStorage.getItem("inventario"));
  
  inventarioHTML.innerHTML = "";
  for (const item in inventario) {
    inventarioHTML.innerHTML +=  `<li>${item}: ${inventario[item]}</li>`;
  }
}

/* Nodos de texto */
const textNodes = [
  {
    id: 1,
    text: 'Te despertás con dolor de cabeza en la habitación de una taverna. Tus recuerdos de los últimos días son borrosos. Intentás recordar. Estabas viajando con un grupo de aventureros y fueron emboscados por algo en el bosque, algo oscuro... Cada uno corrió por su cuenta, vos perdiste tu arma pero llegaste finalmente al pueblo Javascript. Tu tío vivía acá, aunque no sabías nada de él desde hace años. Decidís ir a buscarlo. Notás una bolsa de cuero que parece tener monedas en la mesa de luz. No es tuya.',
    options: [
      {
        text: 'Tomar las monedas',
        setInventario: { monedas: true },
        stats: [50,0,40,10],
        nextText: 2

      },
      {
        text: 'Dejar las monedas',
        stats: [50,0,40,10],
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    text: 'Salís del cuarto y bajás las escaleras. Notás unas cuantas mesas ocupadas y suponés que ya pasó el mediodía. No reconocés a la mujer que atiende la barra y dudás si acercarte a hablarle. Tenés hambre.',
    options: [
      {
        text: 'Comprar pan con las monedas',
        requiredInventario: (currentInventario) => currentInventario.monedas,
        setInventario: { monedas: false, pan: true },
        stats: [50,0,38,12],
        nextText: 3
      },
      {
        text: 'Comprar cerveza con las monedas',
        requiredInventario: (currentInventario) => currentInventario.monedas,
        setInventario: { monedas: false, cerveza: true },
        stats: [50,0,38,12],
        nextText: 3
      },
      {
        text: 'Salir de la taverna',
        stats: [50,0,38,12],
        nextText: 3
      }
    ]
  },
  {
    id: 3,
    text: 'Estás preocupado por no tener armas, pero al menos te encontrás dentro del pueblo. Caminas por un callejón que va hacia la plaza central y ves algunos negocios en el camino. Te gustaría tener plata para equiparte con todo lo necesario.',
    options: [
      {
        text: 'Hablar con el herrero',
        requiredInventario: (currentInventario) => currentInventario.monedas,
        stats: [50,0,35,15],
        nextText: 4
      },
      {
        text: 'Ir al boticario',
        stats: [50,0,35,15],
        nextText: 5
      },
      {
        text: 'Ir a la plaza',
        stats: [50,0,25,25],
        nextText: 6
      }
    ]
  },
  {
    id: 4,
    text: 'Al acercarte el herrero levanta brevemente la mirada y vuelve a concentrarse en la espada a rojo vivo que está martillando. "¿Buscás protegerte o hacer daño?", te pregunta.',
    options: [
      {
        text: 'Comprar una espada y salir',
        requiredInventario: (currentInventario) => currentInventario.monedas,
        setInventario: { monedas: false, espada: true },
        stats: [50,0,25,25],
        nextText: 6
      },
      {
        text: 'Comprar un escudo y salir',
        requiredInventario: (currentInventario) => currentInventario.monedas,
        setInventario: { monedas: false, escudo: true },
        stats: [50,0,25,25],
        nextText: 6
      },
    ]
  },
  {
    id: 5,
    text: 'Al abrir la puerta tenés que dar un paso atrás por el fuerte olor que te golpea. Ahora preparado, entrás y ves a una anciana ciega fumando una pipa sentada junto al mostrador. "La magia negra te sigue", dice.  Antes de que puedas decir algo la anciana se levanta y se dirige a un cuarto trasero acariciando las paredes, suponés que para guiarse. Luego de unos minutos vuelve con una pequeña pócima que coloca sobre el mostrador. Tiene un cartel que dice savia de árbol. "Serían 5 monedas", agrega.',
    options: [
      {
        text: 'Robar la pócima e irte del local',
        setInventario: { pócima: true },
        stats: [50,0,25,25],
        nextText: 6
      },
      {
        text: 'Comprar la pócima con tus monedas',
        requiredInventario: (currentInventario) => currentInventario.monedas,
        setInventario: { monedas: false, pócima: true },
        stats: [50,0,25,25],
        nextText: 6
      },
      {
        text: 'La mujer te da desconfianza, te vas sin la pócima',
        stats: [50,0,25,25],
        nextText: 6
      },
    ]
  },
  {
    id: 6,
    text: 'Después de caminar un rato por la ciudad llegás a la plaza central. Decidís sentarte junto a un árbol y analizar brevemente el flujo de gente. Al quedarte quieto te acordás que tenés mucha hambre. Luego de unos minutos ves pasar a un hombre bien vestido que te resulta familiar, creés que es un conocido de tu tío. Sin otra idea mejor decidís seguirlo.',
    options: [
      {
        text: 'Comer el pan y seguirlo',
        requiredInventario: (currentInventario) => currentInventario.pan,
        setInventario: { pan: false , satisfecho: true },
        stats: [50,0,35,15],
        nextText: 7
      },
      {
        text: 'Aguantar el hambre y seguirlo',
        setInventario: { hambre: true },
        stats: [50,0,20,30],
        nextText: 7
      },
    ]
  },
  {
    id: 7,
    text: 'El hombre se dirige con prisa al castillo. Te cuesta seguirle el ritmo entre la multitud que anda por las calles. A unos 60 metros de la puerta levadiza el hombre dobla en un callejón. Cuando llegás ya no lo ves, al final del callejón hay una puerta y unos 15 metros más arriba una ventana abierta.',
    options: [
      {
        text: 'Intentar trepar a la ventana',
        stats: [0,1,0,0],
        nextText: 8
      },
      {
        text: 'Intentar abrir la puerta',
        nextText: 9
      },
      {
        text: 'Salir del callejón y preguntar por tu tío en la entrada',
        nextText: 10
      }
    ]
  },
  {
    id: 8,
    text: 'Lográs empezar a trepar con destreza agarrándote de algunos adoquines que sobresalen de la pared. Cuando estás por llegar uno de los adoquines se desprende y caés de nuca al piso. Se te nubla la mirada hasta que solo ves negro.',
    options: [
      {
        text: 'Reiniciar',
        nextText: -1
      }
    ]
  },
  {
    id: 9,
    text: 'Intentás abrir la puerta en silencio pero está cerrada con llave. Mirás a tu alrededor y encontras un fierrito que creés que podrías usar para romper la cerradura. Después de unos quince minutos escuchás que el mecanismo cedió pero hizo más ruido del que debería, una voces se alertaron y se dirigen hacia tu lado. Decidís buscar un escondite pero tardás mucho y la puerta se abre de repente.',
    options: [
      {
        text: 'Continuar',
        setInventario: { victoria: true },
        nextText: 11
      }
    ]
  },
  {
    id: 10,
    text: 'Al acercarte a la entrada no se te ocurre mejor idea que preguntar por tu tío. Las chances de que hayas perdido el tiempo y te manden a otro lugar son muy altas, así que no estás perdiendo nada. Sin embargo, al decir su nombre, uno de los guardias levanta las cejas y mira a su compañero. Te pide que esperes mientras ingresa al castillo. Al rato el guardia viene con un hombre viejo y otro guardia enorme. Te toman de los brazos y sin decir palabra te llevan forcejeando al calabozo.',
    options: [
      {
        text: 'Después de 2 noches te morís de hambre en el calabozo. Reiniciar.',
        requiredInventario: (currentInventario) => currentInventario.hambre,
        nextText: -1
      },
      {
        text: 'Después de 2 días te sirven un puchero y un hombre se acerca a verte',
        requiredInventario: (currentInventario) => currentInventario.satisfecho,
        setInventario: { victoria: true },
        stats: [50,0,50,0],
        nextText: 11
      }
    ]
  },
  {
    id: 11,
    text: 'Aliviado, te das cuenta que conocés al viejo canoso. Te invita a pasear con él por un sector del castillo hasta que llegan a una habitación grande. Tienen mucho de que hablar. Continuará...',
    options: [
      {
        text: 'Reiniciar',
        nextText: -1
      }
    ]
  }
]
startGame()