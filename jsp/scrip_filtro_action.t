
document.addEventListener('DOMContentLoaded', () => {
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(item => {
        item.addEventListener('click', async () => {
            const action = item.getAttribute('data-action');

            if (action === 'eliminar') {
                if (confirm("¿Estás seguro de que quieres eliminar todos los registros?")) {
                    try {
                        const querySnapshot = await getDocs(collection(db, 'tu_coleccion'));

                        for (const doc of querySnapshot.docs) {
                            await deleteDoc(doc.ref);
                        }

                        alert("Todos los registros han sido eliminados exitosamente");

                        // Actualiza la tabla después de la eliminación
                        loadData();

                        // Oculta la sección de detalles y muestra las secciones de la tabla y el filtro
                        document.getElementById('details').style.display = 'none';
                        document.querySelector('.table-section').style.display = 'block';
                        document.querySelector('.filter-section').style.display = 'block';
                    } catch (e) {
                        console.error('Error al eliminar los registros: ', e);
                        alert('Error al eliminar los registros.');
                    }
                }
            }
        });
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const configButton = document.getElementById('configButton');
    const configMenu = document.getElementById('configMenu');

    // Mostrar/ocultar menú al hacer clic en el botón de configuración
    configButton.addEventListener('click', () => {
        configMenu.style.display = configMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Manejar las acciones del menú
    configMenu.addEventListener('click', (event) => {
        const action = event.target.getAttribute('data-action');

        switch (action) {
            case 'explorar':
                console.log('EXPLORAR seleccionado');
                // Lógica para explorar
                break;
            case 'editar':
                console.log('EDITAR seleccionado');
                // Lógica para editar
                break;
            case 'eliminar':
                if (confirm('¿Estás seguro de que deseas eliminar todos los registros?')) {
                    eliminarTodosLosRegistros();
                }
                break;
            case 'descargar':
                console.log('DESCARGAR seleccionado');
                // Lógica para descargar
                break;
            case 'otras':
                console.log('OTRAS seleccionado');
                // Lógica para otras opciones
                break;
        }
    });

    // Función para eliminar todos los registros
    function eliminarTodosLosRegistros() {
        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = '';  // Vacía la tabla
        document.getElementById('totalRecords').textContent = 'Total de Registros: 0';
        document.getElementById('filteredRecords').textContent = 'Registros Filtrados: 0';
        alert('Todos los registros han sido eliminados.');
    }

    // Cierra el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        if (!configButton.contains(event.target) && !configMenu.contains(event.target)) {
            configMenu.style.display = 'none';
        }
    });
});


