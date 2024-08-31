


import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, writeBatch } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2YHOPydtFOFn5Sr3PXNp6H-6TM0p3Urc",
    authDomain: "tramitesvisa-itzel.firebaseapp.com",
    projectId: "tramitesvisa-itzel",
    storageBucket: "tramitesvisa-itzel.appspot.com",
    messagingSenderId: "356859229057",
    appId: "1:356859229057:web:ab3b905aaacfa2d2b86e80"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function loadFormData() {
    try {
        const querySnapshot = await getDocs(collection(db, 'formularios'));
        const tableBody = document.getElementById('formTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';  // Limpia el contenido de la tabla
        let totalRecords = 0;

        querySnapshot.forEach(async (doc) => {
            const data = doc.data();
            const row = tableBody.insertRow();  // Inserta una nueva fila en la tabla

            row.insertCell(0).textContent = data.fecha_hora || '';
            row.insertCell(1).textContent = data.tipo_solicitud || '';
            row.insertCell(2).textContent = data.nombre || '';
            row.insertCell(3).textContent = data.telefono || '';
            row.insertCell(4).textContent = data.correo || '';

            row.insertCell(5).textContent = data.fecha_ultimavisita_usa || '';
            row.insertCell(6).textContent = data.duracion_en_usa || '';
            row.insertCell(7).textContent = data.cantidad_dias_meses || '';



            // Datos Personales
            row.insertCell(8).textContent = data.apellido_paterno || '';
            row.insertCell(9).textContent = data.apellido_materno || '';
            row.insertCell(10).textContent = data.nombres || '';
            row.insertCell(11).textContent = data.fecha_nacimiento || '';
            row.insertCell(12).textContent = data.sexo || '';
            row.insertCell(13).textContent = data.lugar_nacimiento || '';
            // Estado Civil
            row.insertCell(14).textContent = data.estado_civil || '';

            // Datos de Cónyuge (solo si está visible)
            row.insertCell(15).textContent = data.nombre_completo_conyuge || '';
            row.insertCell(16).textContent = data.fecha_nacimiento_conyuge || '';
            row.insertCell(17).textContent = data.lugar_nacimiento_conyuge || '';
            
            // Datos del Matrimonio Anterior (solo si está visible)
            row.insertCell(18).textContent = data.nombre_completo_expareja || '';
            row.insertCell(19).textContent = data.fecha_union_expareja || '';
            row.insertCell(20).textContent = data.lugar_nacimiento_expareja || '';
            row.insertCell(21).textContent = data.motivo_separacion_expareja || '';
            row.insertCell(22).textContent = data.fecha_divorcio_expareja || '';
            row.insertCell(23).textContent = data.pais_termino_matrimonio || '';

            // Datos del Cónyuge Union Libre (solo si está visible)
            row.insertCell(24).textContent = data.nombre_completo_conyuge_union_libre || '';
            row.insertCell(25).textContent = data.fecha_nacimiento_conyuge_union_libre || '';
            row.insertCell(26).textContent = data.lugar_nacimiento_conyuge_union_libre || '';

            // Escolaridad
            row.insertCell(27).textContent = data.escolaridad || '';
            row.insertCell(28).textContent = data.nombre_escuela || '';
            row.insertCell(29).textContent = data.direccion_escuela || '';
            row.insertCell(30).textContent = data.fecha_inicio_escuela || '';
            row.insertCell(31).textContent = data.fecha_final_escuela || '';


            // Empleo Actual
            // Información Laboral
            row.insertCell(32).textContent = data.ocupacion_actual_empleo || '';
            row.insertCell(33).textContent = data.nombre_empresa_actual || '';
            row.insertCell(34).textContent = data.domicilio_empresas_actual || '';
            row.insertCell(35).textContent = data.fecha_inicio_empleo_actual || '';
            row.insertCell(36).textContent = data.telefono_empres_actual || '';
            row.insertCell(37).textContent = data.salario_ensual_empleo_actual || '';
            row.insertCell(38).textContent = data.descripcion_actividades_a_su_cargo || '';

 
            // Información Laboral Anterior
            row.insertCell(39).textContent = data.nombre_empresa_anterior || '';
            row.insertCell(40).textContent = data.domicilio_empresas_anterior || '';
            row.insertCell(41).textContent = data.fecha_inicio_empleo_anterior || '';
            row.insertCell(42).textContent = data.fecha_fin_empleo_anterior || '';
            row.insertCell(43).textContent = data.descripcion_actividades_empleo_anterior || '';
            row.insertCell(44).textContent = data.nombre_jefe_inmediato || '';
            row.insertCell(45).textContent = data.telefono_jefe_inmediato || '';

            // Datos del Padre y Madre
            row.insertCell(46).textContent = data.nombre_completo_padre || '';
            row.insertCell(47).textContent = data.fecha_nacimiento_padre || '';
            row.insertCell(48).textContent = data.padre_vive_estados_unidos|| '';
            row.insertCell(49).textContent = data.nombre_completo_madre || '';
            row.insertCell(50).textContent = data.fecha_nacimiento_madre || '';
            row.insertCell(51).textContent = data.madre_vive_estados_unidos || '';

            // Redes Sociales y Familiares
            row.insertCell(52).textContent = data.facebook || '';
            row.insertCell(53).textContent = data.instagram || '';


            // Información de Visas y Viajes
            row.insertCell(54).textContent = data.tiene_familiares_estados_unidos || '';
            row.insertCell(55).textContent = data.nombre_completo_familiar_cercano || '';
            row.insertCell(56).textContent = data.numero_telefonico_familiar_cercano || '';
            row.insertCell(57).textContent = data.domicilio_familiar_cercano || '';
            row.insertCell(58).textContent = data.tramitaron_visa_antes || '';
            row.insertCell(59).textContent = data.redacta_procedimiento_realizado || '';
            row.insertCell(60).textContent = data.han_visitado_estados_unidos || '';
            row.insertCell(61).textContent = data.fecha_visita_estados_unidos || '';
            row.insertCell(62).textContent = data.han_viajado_extranjero_últimos_cinco_años || '';
            row.insertCell(63).textContent = data.pais || '';
            row.insertCell(64).textContent = data.domina_ingles || '';




            // Manejo de imágenes
            const imgFrontCell = row.insertCell(8);
            if (data.foto1URL) {
                try {
                    const imgFrontRef = ref(storage, data.foto1URL);
                    const imgFrontURL = await getDownloadURL(imgFrontRef);
                    const imgFrontLink = document.createElement('a');
                    imgFrontLink.href = imgFrontURL;
                    imgFrontLink.textContent = 'Ver Imagen Frente';
                    imgFrontLink.target = '_blank';
                    imgFrontCell.appendChild(imgFrontLink);
                } catch (error) {
                    imgFrontCell.textContent = 'Imagen no disponible';
                    console.error('Error al obtener la URL de la imagen frente:', error);
                }
            } else {
                imgFrontCell.textContent = 'Imagen no disponible';
            }

            const imgBackCell = row.insertCell(9);
            if (data.foto2URL) {
                try {
                    const imgBackRef = ref(storage, data.foto2URL);
                    const imgBackURL = await getDownloadURL(imgBackRef);
                    const imgBackLink = document.createElement('a');
                    imgBackLink.href = imgBackURL;
                    imgBackLink.textContent = 'Ver Imagen Reverso';
                    imgBackLink.target = '_blank';
                    imgBackCell.appendChild(imgBackLink);
                } catch (error) {
                    imgBackCell.textContent = 'Imagen no disponible';
                    console.error('Error al obtener la URL de la imagen reverso:', error);
                }
            } else {
                imgBackCell.textContent = 'Imagen no disponible';
            }

            const birthActCell = row.insertCell(10);
            if (data.foto3URL) {
                try {
                    const birthActRef = ref(storage, data.foto3URL);
                    const birthActURL = await getDownloadURL(birthActRef);
                    const birthActLink = document.createElement('a');
                    birthActLink.href = birthActURL;
                    birthActLink.textContent = 'Ver Acta de Nacimiento';
                    birthActLink.target = '_blank';
                    birthActCell.appendChild(birthActLink);
                } catch (error) {
                    birthActCell.textContent = 'Acta no disponible';
                    console.error('Error al obtener la URL del acta de nacimiento:', error);
                }
            } else {
                birthActCell.textContent = 'Acta no disponible';
            }

            const passportCell = row.insertCell(11);
            if (data.foto4URL) {
                try {
                    const passportRef = ref(storage, data.foto4URL);
                    const passportURL = await getDownloadURL(passportRef);
                    const passportLink = document.createElement('a');
                    passportLink.href = passportURL;
                    passportLink.textContent = 'Ver Pasaporte';
                    passportLink.target = '_blank';
                    passportCell.appendChild(passportLink);
                } catch (error) {
                    passportCell.textContent = 'Pasaporte no disponible';
                    console.error('Error al obtener la URL del pasaporte:', error);
                }
            } else {
                passportCell.textContent = 'Pasaporte no disponible';
            }

            const ineCell = row.insertCell(12);
            if (data.foto5URL) {
                try {
                    const ineRef = ref(storage, data.foto5URL);
                    const ineURL = await getDownloadURL(ineRef);
                    const ineLink = document.createElement('a');
                    ineLink.href = ineURL;
                    ineLink.textContent = 'Ver INE';
                    ineLink.target = '_blank';
                    ineCell.appendChild(ineLink);
                } catch (error) {
                    ineCell.textContent = 'INE no disponible';
                    console.error('Error al obtener la URL del INE:', error);
                }
            } else {
                ineCell.textContent = 'INE no disponible';
            }

            const fileCell = row.insertCell(13);
            if (data.archivoURL) {
                try {
                    const fileRef = ref(storage, data.archivoURL);
                    const fileURL = await getDownloadURL(fileRef);
                    const fileLink = document.createElement('a');
                    fileLink.href = fileURL;
                    fileLink.textContent = 'Ver Archivo';
                    fileLink.target = '_blank';
                    fileCell.appendChild(fileLink);
                } catch (error) {
                    fileCell.textContent = 'Archivo no disponible';
                    console.error('Error al obtener la URL del archivo:', error);
                }
            } else {
                fileCell.textContent = 'Archivo no disponible';
            }

            totalRecords++;
            document.getElementById('totalRegistros').textContent = totalRecords;
        });



        document.getElementById('totalRegistros').textContent = totalRecords;
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('No se pudo cargar los datos. Verifica la consola para más detalles.');
    }
    // Ordenar datos por fecha de última visita
    sortTable();
}

async function eliminarTodo() {
    try {
        const querySnapshot = await getDocs(collection(db, 'formularios'));
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        alert('Todos los registros han sido eliminados.');
        loadFormData();  // Recargar los datos después de eliminar
    } catch (error) {
        console.error('Error al eliminar los datos:', error);
        alert('No se pudo eliminar los registros. Verifica la consola para más detalles.');
    }
}

function descargarTodo() {
    const table = document.getElementById('formTable');
    const wb = XLSX.utils.table_to_book(table, { sheet: "Datos" });
    XLSX.writeFile(wb, 'datos_formularios.xlsx');
}

document.getElementById('btnRegresar').addEventListener('click', () => window.location.href = 'admin.html');
document.getElementById('btnInicio').addEventListener('click', () => window.location.href = 'index.html');
document.getElementById('btnEliminarTodo').addEventListener('click', eliminarTodo);
document.getElementById('btnDescargarTodo').addEventListener('click', descargarTodo);

window.onload = loadFormData;


// Cargar los datos al iniciar
loadFormData();
window.onload = loadFormData;



