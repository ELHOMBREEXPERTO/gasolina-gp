const form = document.getElementById('gas-form');
const listaRegistros = document.getElementById('lista-registros');

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', mostrarRegistros);

// Cálculo automático de galones
function calcularGalones() {
    const monto = document.getElementById('monto').value;
    const precio = document.getElementById('tipo-gas').value;
    const galonesInput = document.getElementById('galones');

    if (monto > 0) {
        const totalGalones = (monto / precio).toFixed(2);
        galonesInput.value = totalGalones;
    }
}

// Guardar Registro
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const registro = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        tipo: document.getElementById('tipo-gas').options[document.getElementById('tipo-gas').selectedIndex].text.split(' ')[0],
        monto: document.getElementById('monto').value,
        galones: document.getElementById('galones').value,
        precioAplicado: document.getElementById('tipo-gas').value
    };

    let historial = JSON.parse(localStorage.getItem('registros-gas')) || [];
    historial.unshift(registro); // Agregar al inicio
    localStorage.setItem('registros-gas', JSON.stringify(historial));

    form.reset();
    ocultarFormulario();
    mostrarRegistros();
});

function mostrarRegistros() {
    let historial = JSON.parse(localStorage.getItem('registros-gas')) || [];
    listaRegistros.innerHTML = '';

    historial.forEach(reg => {
        listaRegistros.innerHTML += `
            <div class="card">
                <p><strong>Fecha:</strong> ${reg.fecha}</p>
                <p><strong>Tipo:</strong> ${reg.tipo} | <strong>RD$:</strong> ${reg.monto}</p>
                <p><strong>Galones:</strong> ${reg.galones} (a RD$${reg.precioAplicado})</p>
                <div class="acciones-registro">
                    <button class="btn-eliminar" onclick="borrarRegistro(${reg.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
}

// Borrar un registro individual por id
function borrarRegistro(id) {
    if (!confirm('¿Borrar este registro? Podrás deshacer en pocos segundos.')) return;

    let historial = JSON.parse(localStorage.getItem('registros-gas')) || [];
    const index = historial.findIndex(reg => reg.id == id);
    if (index === -1) return;

    const eliminado = historial.splice(index, 1)[0];
    localStorage.setItem('registros-gas', JSON.stringify(historial));
    mostrarRegistros();

    // Mostrar opción de deshacer
    mostrarUndo(eliminado, index);
}

// --- Lógica de deshacer ---
let _ultimoEliminado = null;
let _undoTimeout = null;

function mostrarUndo(registro, index) {
    _ultimoEliminado = { registro, index };
    const toast = document.getElementById('undo-toast');
    const msg = document.getElementById('undo-msg');
    const btn = document.getElementById('undo-btn');

    if (!toast || !msg || !btn) return;

    msg.textContent = 'Registro eliminado';
    toast.classList.remove('oculto');

    // Asegurar un solo manejador activo
    btn.onclick = () => {
        deshacerEliminacion();
    };

    // Limpiar cualquier timeout anterior
    if (_undoTimeout) clearTimeout(_undoTimeout);
    _undoTimeout = setTimeout(() => {
        ocultarUndo();
        _ultimoEliminado = null;
    }, 5000);
}

function ocultarUndo() {
    const toast = document.getElementById('undo-toast');
    if (!toast) return;
    toast.classList.add('oculto');
}

function deshacerEliminacion() {
    if (!_ultimoEliminado) return;

    let historial = JSON.parse(localStorage.getItem('registros-gas')) || [];
    const { registro, index } = _ultimoEliminado;

    // Insertar en la posición original si es válida, si no, al inicio
    const pos = Math.min(Math.max(0, index), historial.length);
    historial.splice(pos, 0, registro);
    localStorage.setItem('registros-gas', JSON.stringify(historial));
    mostrarRegistros();

    // Limpiar estado
    if (_undoTimeout) clearTimeout(_undoTimeout);
    _ultimoEliminado = null;
    ocultarUndo();
}

// Funciones de interfaz
function mostrarFormulario() { document.getElementById('seccion-formulario').classList.remove('oculto'); }
function ocultarFormulario() { document.getElementById('seccion-formulario').classList.add('oculto'); }

// Borrar todo el historial de consumo
function borrarHistorial() {
    if (confirm('¿Estás seguro de que deseas borrar todo el historial? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('registros-gas');
        mostrarRegistros();
        alert('Historial borrado.');
    }
}