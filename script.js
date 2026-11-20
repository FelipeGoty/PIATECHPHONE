
/* =====================================
   TECH PHONE - SISTEMA DE CARRITO
===================================== */

// CATÁLOGO DE PRODUCTOS

let productos = [
    {
        id: 1,
        nombre: "iPhone",
        marca: "Apple",
        precio: 14999,
        imagen: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300"
    },
    {
        id: 2,
        nombre: "Samsung Galaxy",
        marca: "Samsung",
        precio: 11499,
        imagen: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300"
    },
    {
        id: 3,
        nombre: "Xiaomi Redmi",
        marca: "Xiaomi",
        precio: 6499,
        imagen: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300"
    }
];

// RECUPERAR CARRITO GUARDADO

let carrito = [];

try {
    const carritoGuardado = JSON.parse(
        localStorage.getItem("techPhoneCarrito")
    );

    if (Array.isArray(carritoGuardado)) {
        carrito = carritoGuardado
            .filter(item =>
                productos.some(p => p.id === item.id) &&
                Number.isInteger(item.cantidad) &&
                item.cantidad > 0
            )
            .map(item => ({
                id: item.id,
                cantidad: Math.min(item.cantidad, 99)
            }));
    }
} catch (error) {
    carrito = [];
}

// FORMATO DE PRECIOS

function formatoPrecio(precio) {
    return precio.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

// GUARDAR CARRITO

function guardarCarrito() {
    localStorage.setItem(
        "techPhoneCarrito",
        JSON.stringify(carrito)
    );
}

// AGREGAR PRODUCTOS

function agregarCarrito(id) {

    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    const productoExistente = carrito.find(p => p.id === id);

    if (productoExistente) {

        if (productoExistente.cantidad >= 99) {
            alert("Máximo 99 unidades por producto.");
            return;
        }

        productoExistente.cantidad++;

    } else {

        carrito.push({
            id: id,
            cantidad: 1
        });

    }

    guardarCarrito();
    actualizarCarrito();

    mostrarNotificacion(
        producto.nombre + " agregado al carrito"
    );
}

// ACTUALIZAR CARRITO

function actualizarCarrito() {

    const lista = document.getElementById("listaCarrito");
    const contador = document.getElementById("contadorCarrito");

    const carritoVacio = document.getElementById("carritoVacio");
    const resumen = document.getElementById("carritoResumen");

    const totalUnidades = document.getElementById("totalUnidades");
    const subtotalElemento = document.getElementById("subtotalCarrito");
    const totalElemento = document.getElementById("totalCarrito");

    let unidades = 0;
    let subtotal = 0;

    lista.innerHTML = "";

    carrito.forEach(item => {

        const producto = productos.find(p => p.id === item.id);

        if (!producto) return;

        const cantidad = item.cantidad;

        const totalProducto = producto.precio * cantidad;

        unidades += cantidad;
        subtotal += totalProducto;

        const tarjeta = document.createElement("article");

        tarjeta.className = "item-carrito";

        tarjeta.innerHTML = `
            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div class="item-info">

                <h3>${producto.nombre}</h3>

                <p>${formatoPrecio(producto.precio)}</p>

                <div class="controles-cantidad">

                    <button
                        type="button"
                        onclick="cambiarCantidad(${producto.id}, -1)"
                        aria-label="Disminuir cantidad"
                    >−</button>

                    <span>${cantidad}</span>

                    <button
                        type="button"
                        onclick="cambiarCantidad(${producto.id}, 1)"
                        aria-label="Aumentar cantidad"
                    >+</button>

                </div>

            </div>

            <div class="item-derecha">

                <strong>${formatoPrecio(totalProducto)}</strong>

                <button
                    class="eliminar-producto"
                    type="button"
                    onclick="eliminarProducto(${producto.id})"
                >
                    Eliminar
                </button>

            </div>
        `;

        lista.appendChild(tarjeta);

    });

    contador.textContent = unidades;

    totalUnidades.textContent = unidades;

    subtotalElemento.textContent = formatoPrecio(subtotal);

    totalElemento.textContent = formatoPrecio(subtotal);

    if (unidades === 0) {

        carritoVacio.style.display = "flex";
        resumen.style.display = "none";
        lista.style.display = "none";

    } else {

        carritoVacio.style.display = "none";
        resumen.style.display = "block";
        lista.style.display = "block";

    }

}

// CAMBIAR CANTIDAD

function cambiarCantidad(id, cambio) {

    const producto = carrito.find(p => p.id === id);

    if (!producto) return;

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {

        carrito = carrito.filter(p => p.id !== id);

    } else if (producto.cantidad > 99) {

        producto.cantidad = 99;

    }

    guardarCarrito();
    actualizarCarrito();

}

// ELIMINAR PRODUCTO

function eliminarProducto(id) {

    carrito = carrito.filter(p => p.id !== id);

    guardarCarrito();
    actualizarCarrito();

}

// VACIAR CARRITO

function vaciarCarrito() {

    if (carrito.length === 0) return;

    const confirmar = confirm(
        "¿Estás seguro de que quieres vaciar tu carrito?"
    );

    if (!confirmar) return;

    carrito = [];

    guardarCarrito();
    actualizarCarrito();

}

// ABRIR CARRITO

function abrirCarrito() {

    document.getElementById("fondoCarrito")
        .classList.add("carrito-visible");

    document.body.classList.add("carrito-abierto");

}

// CERRAR CARRITO

function cerrarCarrito() {

    document.getElementById("fondoCarrito")
        .classList.remove("carrito-visible");

    document.body.classList.remove("carrito-abierto");

}

// NOTIFICACIONES

function mostrarNotificacion(mensaje) {

    const notificacion = document.createElement("div");

    notificacion.className = "notificacion";
    notificacion.textContent = "✓ " + mensaje;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 2500);

}

// BUSCADOR

function buscarCelulares() {

    const texto = document.getElementById("searchBar")
        .value.toLowerCase().trim();

    const tarjetas = document.querySelectorAll(".producto");

    const mensaje = document.getElementById("mensajeBusqueda");

    let encontrados = 0;

    tarjetas.forEach(tarjeta => {

        const contenido = tarjeta.textContent.toLowerCase();

        const coincide = contenido.includes(texto);

        tarjeta.style.display = coincide ? "block" : "none";

        if (coincide) encontrados++;

    });

    if (!texto) {

        mensaje.textContent = "";

    } else if (encontrados > 0) {

        mensaje.textContent =
            "Encontramos " + encontrados + " producto(s).";

    } else {

        mensaje.textContent =
            "No encontramos celulares con ese nombre.";

    }

}

// BUSCAR CON ENTER

async function cargarProductosJSON() {

    try {
        const respuesta = await fetch("./productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar productos.json");
        }

        const adicionales = await respuesta.json();

        adicionales.forEach(producto => {

            if (!productos.some(item => item.id === producto.id)) {
                productos.push(producto);
            }

        });

        const carritoGuardado = JSON.parse(
            localStorage.getItem("techPhoneCarrito")
        );

        if (Array.isArray(carritoGuardado)) {
            carrito = carritoGuardado
                .filter(item =>
                    productos.some(p => p.id === item.id) &&
                    Number.isInteger(item.cantidad) &&
                    item.cantidad > 0
                )
                .map(item => ({
                    id: item.id,
                    cantidad: Math.min(item.cantidad, 99)
                }));
        }

        const contenedor = document.getElementById("destacados");

        if (contenedor) {

            adicionales.forEach(producto => {

                const tarjeta = document.createElement("article");
                tarjeta.className = "producto";

                tarjeta.innerHTML = `
                    <span class="producto-etiqueta">NUEVO</span>
                    <div class="producto-imagen">
                        <span class="emoji-producto" role="img"
                              aria-label="Imagen de ${producto.nombre}">
                            ${producto.imagen}
                        </span>
                    </div>
                    <span class="marca-producto">${producto.marca.toUpperCase()}</span>
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <strong class="precio">${formatoPrecio(producto.precio)} MXN</strong>
                    <button type="button" onclick="agregarCarrito(${producto.id})">
                        🛒 Agregar al carrito
                    </button>
                `;

                contenedor.appendChild(tarjeta);

            });

        }

        actualizarCarrito();

    } catch (error) {
        console.error(error);
    }

}

document.addEventListener("DOMContentLoaded", function() {

    const buscador = document.getElementById("searchBar");

    if (buscador) {
        buscador.addEventListener("keydown", function(event) {

            if (event.key === "Enter") {
                buscarCelulares();
            }

        });
    }

    actualizarCarrito();
    cargarProductosJSON();

});

// FINALIZAR COMPRA (SIMULACIÓN ESCOLAR)

function finalizarCompra() {

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let resumenCompra = "";

    let total = 0;

    carrito.forEach(item => {

        const producto = productos.find(p => p.id === item.id);

        if (!producto) return;

        const precio = producto.precio * item.cantidad;

        total += precio;

        resumenCompra +=
            producto.nombre +
            " x " + item.cantidad +
            " = " + formatoPrecio(precio) + "\n";

    });

    const confirmar = confirm(
        "RESUMEN DE TU COMPRA\n\n" +
        resumenCompra +
        "\nTOTAL: " + formatoPrecio(total) +
        "\n\n¿Deseas confirmar este pedido de demostración?"
    );

    if (!confirmar) return;

    const numeroPedido = "TP-" + Date.now().toString().slice(-8);

    alert(
        "¡COMPRA DE DEMOSTRACIÓN EXITOSA!\n\n" +
        "Pedido: " + numeroPedido +
        "\nTotal: " + formatoPrecio(total) +
        "\n\nGracias por visitar TECH PHONE."
    );

    carrito = [];

    guardarCarrito();
    actualizarCarrito();

    cerrarCarrito();

}

// ======================================
// CONSULTAR CELULARES CON DUMMYJSON
// ======================================

async function obtenerProductosExternos() {

    try {

        const respuesta = await fetch(
            "https://dummyjson.com/products/category/smartphones"
        );

        if (!respuesta.ok) {
            throw new Error("Error al consultar productos");
        }

        const datos = await respuesta.json();

        console.log("Productos obtenidos:", datos.products);

        return datos.products;

    } catch (error) {

        console.error("Error:", error);
        return [];

    }
}

// Ejecutar consulta
obtenerProductosExternos();
