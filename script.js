// Función para agregar una persona a un rango
function addPerson(rank) {
    const input = document.getElementById(`${rank}Input`);
    const name = input.value.trim();  // Obtener el valor del campo de entrada

    if (name === '') {
        alert('Por favor, ingrese un nombre.');
        return;
    }

    // Hacer un fetch al servidor para agregar el nombre al archivo
    fetch(`https://lossantosnetworksheriff.github.io/add-name/${rank}`, {  // Ruta actualizada
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    })
    .then(response => {
        if (response.ok) {
            console.log(`Jugador agregado al rango ${rank}`);
            input.value = '';  // Limpiar el campo de entrada
            updateRankList(rank);  // Actualizar la lista de jugadores después de agregar
        } else {
            console.log('Error al agregar jugador');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Función para actualizar la lista de jugadores para un rango
function updateRankList(rank) {
    const rankList = document.getElementById(`${rank}List`);

    // Hacer un fetch al servidor para obtener los jugadores de un rango
    fetch(`https://lossantosnetworksheriff.github.io/get-names/${rank}`)  // Ruta actualizada
        .then(response => {
            if (!response.ok) {
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                rankList.innerHTML = ''; // Limpiar la lista antes de agregar los nuevos jugadores

                if (data.length === 0) {
                    rankList.innerHTML = '<li>No hay jugadores en este rango</li>';
                    return;
                }

                // Agregar cada jugador a la lista HTML
                data.forEach(name => {
                    const listItem = document.createElement('li');
                    listItem.textContent = name;

                    // Crear el botón de eliminar
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Eliminar';
                    deleteBtn.classList.add('delete-btn');
                    deleteBtn.onclick = () => removePlayer(rank, name, listItem);  // Llamar a la función de eliminar jugador

                    // Agregar el botón al elemento de la lista
                    listItem.appendChild(deleteBtn);

                    // Agregar el elemento a la lista
                    rankList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error al actualizar la lista de jugadores:', error);
        });
}

// Función para eliminar un jugador de un rango
function removePlayer(rank, name, listItem) {
    fetch(`https://lossantosnetworksheriff.github.io/remove-name/${rank}`, {  // Ruta actualizada
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    })
    .then(response => {
        if (response.ok) {
            console.log(`Jugador ${name} eliminado del rango ${rank}`);
            listItem.remove();
        } else {
            console.log('Error al eliminar jugador');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Función para cargar las listas de jugadores al cargar la página
window.onload = () => {
    const ranks = [
        'sheriff', 'undersheriff', 'captain', 'teniente', 'sergeant',
        'seniorDeputySheriff', 'parkRanger', 'deputySheriff', 'deputySheriffTrainee'
    ];

    // Cargar las listas de jugadores para cada rango
    ranks.forEach(rank => {
        updateRankList(rank);
    });
};
