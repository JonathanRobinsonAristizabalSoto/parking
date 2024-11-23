document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const modalVer = document.getElementById('modalVer');
    const modalEliminar = document.getElementById('modalEliminar');
    const abrirModal = document.getElementById('openModal');
    const cerrarModal = document.getElementById('closeModal');
    const cerrarModalVer = document.getElementById('closeModalVer');
    const btnEliminarConfirmar = document.getElementById('btnEliminarConfirmar');
    const btnEliminarCancelar = document.getElementById('btnEliminarCancelar');
    const dataForm = document.getElementById('dataForm');
    const dataTable = document.getElementById('dataTable');
    const modalMensaje = document.getElementById('modalMensaje');
    const mensajeTexto = document.getElementById('mensajeTexto');
    let currentIdToDelete = null;

    abrirModal.addEventListener('click', () => {
        modal.classList.remove('hidden');
        dataForm.reset();
        document.getElementById('id').value = '';
    });

    cerrarModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    cerrarModalVer.addEventListener('click', () => {
        modalVer.classList.add('hidden');
    });

    btnEliminarCancelar.addEventListener('click', () => {
        modalEliminar.classList.add('hidden');
        currentIdToDelete = null;
    });

    btnEliminarConfirmar.addEventListener('click', () => {
        if (currentIdToDelete) {
            fetch('https://aplicacionessena.com/server_producto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=delete&id=${currentIdToDelete}`
            })
            .then(response => response.json())
            .then(data => {
                mostrarMensaje(data.success ? 'exito' : 'error', data.message);
                if (data.success) {
                    fetchProductos();
                }
                modalEliminar.classList.add('hidden');
                currentIdToDelete = null;
            })
            .catch(error => {
                mostrarMensaje('error', 'Error al eliminar producto. Inténtalo nuevamente.');
                console.error('Error:', error);
                modalEliminar.classList.add('hidden');
                currentIdToDelete = null;
            });
        }
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
        if (event.target === modalVer) {
            modalVer.classList.add('hidden');
        }
        if (event.target === modalEliminar) {
            modalEliminar.classList.add('hidden');
        }
    });

    dataForm.addEventListener('submit', enviarDatos);

    function enviarDatos(event) {
        event.preventDefault();

        const formData = new FormData(dataForm);
        const action = formData.get('id') ? 'update' : 'add';
        formData.append('action', action);

        fetch('https://aplicacionessena.com/server_producto.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            mostrarMensaje(data.success ? 'exito' : 'error', data.message);
            if (data.success) {
                modal.classList.add('hidden');
                fetchProductos();
            }
        })
        .catch(error => {
            mostrarMensaje('error', 'Error al enviar datos. Inténtalo nuevamente.');
            console.error('Error:', error);
        });
    }

    function fetchProductos() {
        fetch('https://aplicacionessena.com/server_producto.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=fetch'
        })
        .then(response => response.json())
        .then(data => {
            dataTable.innerHTML = '';
            data.forEach(producto => {
                const row = document.createElement('div');
                row.classList.add('block', 'bg-white', 'md:table-row', 'mb-4', 'md:mb-0', 'border', 'border-gray-200', 'rounded-lg', 'shadow-sm', 'p-4', 'md:p-0');
                row.innerHTML = `
                    <div class="py-2 px-4 block md:table-cell"><span class="md:hidden font-bold">ID: </span>${producto.id_producto}</div>
                    <div class="py-2 px-4 block md:table-cell"><span class="md:hidden font-bold">Nombre: </span>${producto.nombre}</div>
                    <div class="py-2 px-4 block md:table-cell"><span class="md:hidden font-bold">Descripción: </span>${producto.descripcion}</div>
                    <div class="py-2 px-4 block md:table-cell"><span class="md:hidden font-bold">Precio: </span>${producto.precio}</div>
                    <div class="py-2 px-4 block md:table-cell"><span class="md:hidden font-bold">Stock: </span>${producto.stock}</div>
                    <div class="py-2 px-4 block md:table-cell flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-2">
                        <span class="md:hidden font-bold">Acciones: </span>
                        <button class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300" onclick="viewProducto(${producto.id_producto})">Ver</button>
                        <button class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition duration-300" onclick="editProducto(${producto.id_producto})">Editar</button>
                        <button class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300" onclick="confirmDeleteProducto(${producto.id_producto})">Eliminar</button>
                    </div>
                `;
                dataTable.appendChild(row);
            });
        })
        .catch(error => {
            mostrarMensaje('error', 'Error al cargar productos. Inténtalo nuevamente.');
            console.error('Error:', error);
        });
    }

    window.editProducto = function (id) {
        fetch('https://aplicacionessena.com/server_producto.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=fetch&id=${id}`
        })
        .then(response => response.json())
        .then(producto => {
            document.getElementById('id').value = producto.id_producto;
            document.getElementById('nombre').value = producto.nombre;
            document.getElementById('descripcion').value = producto.descripcion;
            document.getElementById('precio').value = producto.precio;
            document.getElementById('stock').value = producto.stock;
            modal.classList.remove('hidden');
        })
        .catch(error => {
            mostrarMensaje('error', 'Error al cargar producto. Inténtalo nuevamente.');
            console.error('Error:', error);
        });
    };

    window.confirmDeleteProducto = function (id) {
        currentIdToDelete = id;
        modalEliminar.classList.remove('hidden');
    };

    window.viewProducto = function (id) {
        fetch('https://aplicacionessena.com/server_producto.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=fetch&id=${id}`
        })
        .then(response => response.json())
        .then(producto => {
            document.getElementById('verId').textContent = producto.id_producto;
            document.getElementById('verNombre').textContent = producto.nombre;
            document.getElementById('verDescripcion').textContent = producto.descripcion;
            document.getElementById('verPrecio').textContent = producto.precio;
            document.getElementById('verStock').textContent = producto.stock;
            modalVer.classList.remove('hidden');
        })
        .catch(error => {
            mostrarMensaje('error', 'Error al cargar producto. Inténtalo nuevamente.');
            console.error('Error:', error);
        });
    };

    function mostrarMensaje(tipo, mensaje) {
        mensajeTexto.textContent = mensaje;
        modalMensaje.classList.remove('hidden');
        setTimeout(() => {
            modalMensaje.classList.add('hidden');
        }, 3000);
    }

    fetchProductos();
});