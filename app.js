function mostrarRegistros() {
    let historial = JSON.parse(localStorage.getItem('registros-gas')) || [];
    listaRegistros.innerHTML = '';

    historial.forEach(reg => {
        listaRegistros.innerHTML += `
            <div class="card">
                <div class="fecha">${reg.fecha}</div>
                <div class="info-principal">
                    <span>⛽ ${reg.tipo}</span>
                    <span class="monto">RD$${reg.monto}</span>
                </div>
                <div class="detalles">
                    ${reg.galones} galones • RD$${reg.precioAplicado}/gal
                </div>
            </div>
        `;
    });
}
function actualizarResumenMensual() {
    const historial = JSON.parse(localStorage.getItem('registros-gas')) || [];
    const ahora = new Date();
    const mesActual = ahora.getMonth(); // 0 - 11
    const añoActual = ahora.getFullYear();

    // Nombres de los meses para mostrar
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    document.getElementById('nombre-mes').innerText = meses[mesActual];

    // Filtrar y Sumar
    const total = historial.reduce((suma, reg) => {
        // Convertimos la fecha guardada (DD/MM/AAAA) a objeto Date
        const [dia, mes, año] = reg.fecha.split('/');
        const fechaReg = new Date(año, mes - 1, dia);

        if (fechaReg.getMonth() === mesActual && fechaReg.getFullYear() === añoActual) {
            return suma + parseFloat(reg.monto);
        }
        return suma;
    }, 0);

    // Mostrar el total
    document.getElementById('total-mensual').innerText = `RD$ ${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

    // Animación de la barra (ejemplo: meta de RD$ 10,000 al mes)
    const metaMensual = 10000; 
    let porcentaje = (total / metaMensual) * 100;
    if (porcentaje > 100) porcentaje = 100;
    document.getElementById('progreso-barra').style.width = `${porcentaje}%`;
}

// IMPORTANTE: Llama a esta función dentro de mostrarRegistros() 
// para que se actualice cada vez que borres o añadas algo.
function mostrarRegistros() {
    let historial = JSON.parse(localStorage.getItem('registros-gas')) || [];
    listaRegistros.innerHTML = '';

    historial.forEach(reg => {
        listaRegistros.innerHTML += `
            <div class="card">
                <div class="card-header">
                    <span class="fecha">${reg.fecha}</span>
                    <button class="btn-borrar-simple" onclick="eliminarRegistro(${reg.id})">🗑️</button>
                </div>
                <div class="info-principal">
                    <span>⛽ ${reg.tipo}</span>
                    <span class="monto">RD$${reg.monto}</span>
                </div>
                <div class="detalles">
                    ${reg.galones} galones • RD$${reg.precioAplicado}/gal
                </div>
            </div>
        `;
    });
    
    // Actualizamos el resumen mensual cada vez que dibujamos la lista
    actualizarResumenMensual();
}
function eliminarRegistro(id) {
    // Pedir confirmación al usuario
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        let historial = JSON.parse(localStorage.getItem('registros-gas')) || [];
        
        // Filtramos el historial para dejar fuera el ID seleccionado
        historial = historial.filter(reg => reg.id !== id);
        
        // Guardamos el nuevo historial
        localStorage.setItem('registros-gas', JSON.stringify(historial));
        
        // Refrescamos la pantalla
        mostrarRegistros();
    }
}