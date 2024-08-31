
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getFirestore, collection, getDocs, getDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2YHOPydtFOFn5Sr3PXNp6H-6TM0p3Urc",
    authDomain: "tramitesvisa-itzel.firebaseapp.com",
    projectId: "tramitesvisa-itzel",
    storageBucket: "tramitesvisa-itzel.appspot.com",
    messagingSenderId: "356859229057",
    appId: "1:356859229057:web:ab3b905aaacfa2d2b86e80"
};

// Inicializamos la aplicación Firebase con la configuración
const app = initializeApp(firebaseConfig);
// Inicializamos Firestore, la base de datos en tiempo real de Firebase
const db = getFirestore(app);

// Variables globales
let allData = []; // Array para almacenar todos los datos de los formularios
let currentDocId = ''; // ID del documento actual seleccionado
let currentDetailIndex = 0; // Índice para paginación de detalles
let detailKeys = []; // Array para almacenar las claves de los detalles del formulario


// Función asíncrona para cargar los datos del formulario desde Firestore
async function loadFormData() {
    try {
        // Obtenemos todos los documentos de la colección 'formularios'
        const querySnapshot = await getDocs(collection(db, 'formularios'));
        // Obtenemos la referencia al cuerpo de la tabla donde se mostrarán los datos
        const tableBody = document.getElementById('formTable').getElementsByTagName('tbody')[0];
        // Limpiamos el contenido previo de la tabla
        tableBody.innerHTML = '';

        // Inicializamos variables para filtrar los datos
        allData = [];
        const tipoSet = new Set(); // Conjunto para almacenar los tipos de solicitud únicos
        const nombreSet = new Set(); // Conjunto para almacenar los nombres únicos
        const telefonoSet = new Set(); // Conjunto para almacenar los teléfonos únicos

        // Iteramos sobre cada documento en la colección
        querySnapshot.forEach((doc) => {
            const data = doc.data(); // Obtenemos los datos del documento
            allData.push({ id: doc.id, ...data }); // Agregamos los datos al array allData

            // Agregamos los valores a los conjuntos para opciones de búsqueda
            tipoSet.add(data.tipo_solicitud || '');
            nombreSet.add(data.nombre || '');
            telefonoSet.add(data.telefono || '');

            // Insertamos una nueva fila en la tabla para mostrar los datos del formulario
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = data.tipo_solicitud || ''; // Primera columna: tipo de solicitud
            row.insertCell(1).textContent = data.nombre || ''; // Segunda columna: nombre
            row.insertCell(2).textContent = data.telefono || ''; // Tercera columna: teléfono

            // Agregamos un botón para ver los detalles del formulario
            const actionsCell = row.insertCell(3);
            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'Detalles';
            // Asignamos una función para mostrar los detalles al hacer clic en el botón
            detailsButton.onclick = () => showDetails(doc.id);
            actionsCell.appendChild(detailsButton);
        });

        // Mostramos el número total de registros
        document.getElementById('totalRegistros').textContent = allData.length;

        // Rellenamos las opciones de los filtros de búsqueda con los valores únicos
        populateSelectOptions('searchTipo', Array.from(tipoSet));
        populateSelectOptions('searchNombre', Array.from(nombreSet));
        populateSelectOptions('searchTelefono', Array.from(telefonoSet));

        // Asignamos funciones a los eventos de cambio en los filtros
        document.getElementById('searchTipo').addEventListener('change', updateFilters);
        document.getElementById('searchNombre').addEventListener('change', filterTable);
        document.getElementById('searchTelefono').addEventListener('change', filterTable);

        // Filtramos la tabla para mostrar los datos iniciales
        filterTable();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('No se pudo cargar los datos. Verifica la consola para más detalles.');
    }
}
// Función para rellenar las opciones de un select con valores únicos
function populateSelectOptions(selectId, options) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Seleccionar</option>'; // Reseteamos las opciones
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt); // Añadimos la opción al select
    });
}


// Función para actualizar los filtros de búsqueda basados en el tipo seleccionado
function updateFilters() {
    const selectedTipo = document.getElementById('searchTipo').value;
    const filteredData = allData.filter(item => item.tipo_solicitud === selectedTipo || selectedTipo === '');

    const nombres = new Set(filteredData.map(item => item.nombre || ''));
    const telefonos = new Set(filteredData.map(item => item.telefono || ''));

    populateSelectOptions('searchNombre', Array.from(nombres));
    populateSelectOptions('searchTelefono', Array.from(telefonos));

    filterTable();
}

// Función para filtrar la tabla basada en los valores de los filtros
function filterTable() {
    const searchTipo = document.getElementById('searchTipo').value.toLowerCase();
    const searchNombre = document.getElementById('searchNombre').value.toLowerCase();
    const searchTelefono = document.getElementById('searchTelefono').value.toLowerCase();

    const tableBody = document.getElementById('formTable').getElementsByTagName('tbody')[0];
    const rows = tableBody.getElementsByTagName('tr');

    // Iteramos sobre las filas de la tabla y mostramos u ocultamos según los filtros
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const tipo = cells[0].textContent.toLowerCase();
        const nombre = cells[1].textContent.toLowerCase();
        const telefono = cells[2].textContent.toLowerCase();

        // Mostramos la fila si coincide con los filtros, de lo contrario la ocultamos
        if (
            (tipo.includes(searchTipo) || searchTipo === '') &&
            (nombre.includes(searchNombre) || searchNombre === '') &&
            (telefono.includes(searchTelefono) || searchTelefono === '')
        ) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

// Función asíncrona para mostrar los detalles de un formulario específico
async function showDetails(docId) {
    try {
        // Obtenemos la referencia al documento en Firestore
        const docRef = doc(db, 'formularios', docId);
        const docSnap = await getDoc(docRef);

        // Si el documento existe, mostramos los detalles
        if (docSnap.exists()) {
            const data = docSnap.data(); // Obtenemos los datos del documento
            const detailsTableBody = document.getElementById('detailsTable').getElementsByTagName('tbody')[0];
            detailsTableBody.innerHTML = '';  // Limpiamos el contenido de la tabla de detalles

            detailKeys = Object.keys(data); // Guardamos las claves para la paginación
            currentDetailIndex = 0; // Reiniciamos el índice de paginación

            // Mostramos la sección de detalles con los datos del formulario
            displayDetailSection(data);

            currentDocId = docId; // Guardamos el ID del documento actual

            // Ocultamos la sección de filtro y la tabla de registros
            document.getElementById('filterSection').style.display = 'none';
            document.getElementById('tableSection').style.display = 'none';
            document.getElementById('detailsContainer').style.display = 'block';
        } else {
            alert('No se encontraron detalles para este registro.');
        }
    } catch (error) {
        console.error('Error al cargar los detalles:', error);
        alert('No se pudo cargar los detalles. Verifica la consola para más detalles.');
    }
}

function displayDetailSection(data) {
    const detailsTableBody = document.getElementById('detailsTable').getElementsByTagName('tbody')[0];
    detailsTableBody.innerHTML = ''; // Limpia el contenido de la tabla de detalles

    const keysToShow = detailKeys.slice(currentDetailIndex, currentDetailIndex + 5); // Mostrar 5 claves por sección

    keysToShow.forEach(key => {
        const value = data[key] || 'No disponible';
        const row = detailsTableBody.insertRow();
        row.insertCell(0).textContent = key;

        const valueCell = row.insertCell(1);
        valueCell.textContent = value;

        // Crear botón de copiar
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copiar';
        copyButton.onclick = () => copyToClipboard(value);
        valueCell.appendChild(copyButton);
    });

    document.getElementById('nextButton').style.display = (currentDetailIndex + 5 >= detailKeys.length) ? 'none' : 'inline'; // Ocultar el botón si no hay más datos
    document.getElementById('prevButton').style.display = (currentDetailIndex === 0) ? 'none' : 'inline'; // Ocultar el botón si estamos en el primer conjunto de datos
}

// Función para copiar texto al portapapeles
function copyToClipboard(text) {
    // Intentamos escribir el texto en el portapapeles
    navigator.clipboard.writeText(text)
        .then(() => alert('Valor copiado al portapapeles')) // Mostramos un mensaje si se copia correctamente
        .catch(err => console.error('Error al copiar el valor: ', err)); // Mostramos un error en consola si ocurre un problema
}

// Configuración del botón "Volver"
document.getElementById('backButton').onclick = () => {
    // Ocultamos la sección de detalles
    document.getElementById('detailsContainer').style.display = 'none';
    // Mostramos la sección de filtros
    document.getElementById('filterSection').style.display = 'block';
    // Mostramos la sección de la tabla
    document.getElementById('tableSection').style.display = 'block';
};

document.getElementById('deleteButton').onclick = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
        try {
            await deleteDoc(doc(db, 'formularios', currentDocId));
            alert("Registro eliminado exitosamente");
            loadFormData();
            document.getElementById('detailsContainer').style.display = 'none';
            document.getElementById('filterSection').style.display = 'block';
            document.getElementById('tableSection').style.display = 'block';
        } catch (error) {
            console.error("Error eliminando el registro: ", error);
        }
    }
};

document.getElementById('downloadButton').onclick = () => {
    const formData = new FormData(document.getElementById('detailsTable'));
    const dataObj = {};
    formData.forEach((value, key) => {
        dataObj[key] = value;
    });
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registro_${dataObj.nombre || 'desconocido'}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

document.getElementById('nextButton').onclick = () => {
    currentDetailIndex += 5; // Avanzar 5 claves
    if (currentDetailIndex >= detailKeys.length) {
        currentDetailIndex = detailKeys.length - 5; // Asegurar que no se pase del rango
    }
    displayDetailSection(allData.find(item => item.id === currentDocId));
};

document.getElementById('prevButton').onclick = () => {
    currentDetailIndex -= 5; // Retroceder 5 claves
    if (currentDetailIndex < 0) {
        currentDetailIndex = 0; // Asegurar que no se pase del rango
    }
    displayDetailSection(allData.find(item => item.id === currentDocId));
};

// Inicializa la carga de datos al cargar la página
window.onload = loadFormData;
    // Cuando se carga la página, llamamos a la función loadFormData para llenar la tabla con los datos
