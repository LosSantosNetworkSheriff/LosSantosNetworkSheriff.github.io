const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());  // Habilitar CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para agregar un jugador a un rango
app.post('/add-name/:rank', (req, res) => {
    const rank = req.params.rank;
    const { name } = req.body;

    const filePath = path.join(__dirname, `${rank}.txt`);  // Archivo correspondiente al rango

    // Agregar el nombre al archivo
    fs.appendFile(filePath, name + '\n', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar jugador' });
        }
        res.status(200).json({ message: 'Jugador agregado' });
    });
});
// Eliminar un jugador de un rango específico
app.post('/remove-name/:rank', (req, res) => {
    const rank = req.params.rank; // El rango de donde se va a eliminar el nombre
    const name = req.body.name;   // El nombre que se quiere eliminar
    
    if (rank && name) {
        // Aquí debes manejar el código para eliminar el nombre
        // Deberás leer el archivo correspondiente al rango y eliminar el nombre
        const filePath = path.join(__dirname, `${rank}.txt`); // Esto asume que tienes un archivo por cada rango

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo');
            }
            
            const lines = data.split('\n');
            const newLines = lines.filter(line => line.trim() !== name); // Filtra el nombre a eliminar

            fs.writeFile(filePath, newLines.join('\n'), 'utf8', (err) => {
                if (err) {
                    return res.status(500).send('Error al escribir el archivo');
                }
                res.status(200).send('Nombre eliminado con éxito');
            });
        });
    } else {
        res.status(400).send('Datos incorrectos');
    }
});


// Ruta para obtener los jugadores de un rango
app.get('/get-names/:rank', (req, res) => {
    const rank = req.params.rank;
    const filePath = path.join(__dirname, `${rank}.txt`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'No se pudo leer el archivo' });
        }
        const names = data.split('\n').filter(line => line.trim() !== ''); // Filtrar líneas vacías
        res.status(200).json(names);
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
