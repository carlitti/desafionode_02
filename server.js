const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5500;

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
const repertorioPath = './repertorio.json';


app.get('/canciones', (req, res) => {
    fs.readFile(repertorioPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el repertorio');
        res.json(JSON.parse(data));
    });
});


app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    fs.readFile(repertorioPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el repertorio');
        const repertorio = JSON.parse(data);
        repertorio.push(nuevaCancion);
        fs.writeFile(repertorioPath, JSON.stringify(repertorio, null, 2), (err) => {
            if (err) return res.status(500).send('Error al guardar la canción');
            res.send('Canción agregada correctamente');
        });
    });
});


app.put('/canciones/:id', (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    fs.readFile(repertorioPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el repertorio');
        let repertorio = JSON.parse(data);
        repertorio = repertorio.map((cancion) =>
            cancion.id === id ? { ...cancion, ...datosActualizados } : cancion
        );
        fs.writeFile(repertorioPath, JSON.stringify(repertorio, null, 2), (err) => {
            if (err) return res.status(500).send('Error al actualizar la canción');
            res.send('Canción actualizada correctamente');
        });
    });
});


app.delete('/canciones/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(repertorioPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el repertorio');
        const repertorio = JSON.parse(data).filter((cancion) => cancion.id !== id);
        fs.writeFile(repertorioPath, JSON.stringify(repertorio, null, 2), (err) => {
            if (err) return res.status(500).send('Error al eliminar la canción');
            res.send('Canción eliminada correctamente');
        });
    });
});
