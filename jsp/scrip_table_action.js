
// Función para eliminar todos los registros
async function eliminarTodo() {
    const confirmEliminar = confirm('¿Estás seguro de que deseas eliminar todos los registros? Esta acción no se puede deshacer.');
    if (!confirmEliminar) {
        return;  // Salir de la función si el usuario cancela
    }

    const confirmEliminarFinal = confirm('¿Estás absolutamente seguro? Esto eliminará todos los registros.');
    if (!confirmEliminarFinal) {
        return;  // Salir de la función si el usuario cancela
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'formularios'));
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);  // Agrega la eliminación al batch
        });
        await batch.commit();  // Ejecuta el batch
        alert('Todos los registros han sido eliminados.');
        loadFormData();  // Recargar los datos
    } catch (error) {
        console.error('Error al eliminar los documentos:', error);
        alert('No se pudo eliminar los registros. Verifica la consola para más detalles.');
    }
}
function descargarTodo() {
    try {
        const table = document.getElementById('formTable');
        if (!table) {
            throw new Error('La tabla no se encontró en el documento.');
        }

        // Crear un libro de trabajo
        const wb = XLSX.utils.book_new();
        const wsData = [];

        // Obtener los encabezados
        const headers = [];
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            headers.push(table.rows[0].cells[i].innerText);
        }
        wsData.push(headers);

        // Obtener los datos de las filas
        for (let i = 1; i < table.rows.length; i++) {
            const row = [];
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                const cell = table.rows[i].cells[j];
                // Verificar si la celda contiene un enlace
                const link = cell.querySelector('a');
                if (link) {
                    row.push(link.href); // Agregar la URL del enlace
                } else {
                    row.push(cell.innerText); // Agregar el texto de la celda
                }
            }
            wsData.push(row);
        }

        // Crear una hoja de trabajo y agregarla al libro
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Registros');

        // Guardar el archivo
        XLSX.writeFile(wb, 'Registros.xlsx');
    } catch (error) {
        console.error('Error al descargar el archivo:', error);
        alert('No se pudo descargar el archivo. Verifica la consola para más detalles.');
    }
}

// Configuración de eventos para botones
// document.getElementById('btnRegresar').addEventListener('click', () => {
//     window.location.href = '../index.html';
// });

document.getElementById('btnInicio').addEventListener('click', () => {
    window.location.href = '../index.html';
});

document.getElementById('btnEliminarTodo').addEventListener('click', eliminarTodo);

document.getElementById('btnDescargarTodo').addEventListener('click', descargarTodo);
 