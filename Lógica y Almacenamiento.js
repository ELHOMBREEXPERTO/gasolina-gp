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
            </div>
        `;
    });
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