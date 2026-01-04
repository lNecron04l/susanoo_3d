let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* ========= UTILIDADES ========= */
const guardarCarrito = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
};

const actualizarCarrito = () => {
  const lista = document.getElementById("listaCarrito");
  const contador = document.getElementById("contadorCarrito");
  const totalSpan = document.getElementById("totalCarrito");

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;

    lista.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <strong>${item.nombre}</strong><br>
          $${item.precio} x 
          <input type="number" min="1" value="${item.cantidad}"
            class="form-control d-inline w-25"
            onchange="cambiarCantidad(${index}, this.value)">
        </div>
        <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">✕</button>
      </div>
    `;
  });

  contador.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  totalSpan.textContent = total.toLocaleString("es-AR");
};

/* ========= PRODUCTOS ========= */
document.querySelectorAll(".btn-agregar").forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.target.closest(".figuras");

    const id = card.dataset.id;
    const nombre = card.dataset.nombre;
    const precio = Number(card.dataset.precio);

    const existente = carrito.find(p => p.id === id);

    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    animarBoton(e.target);
    guardarCarrito();
  });
});

/* ========= ACCIONES ========= */
const eliminarProducto = index => {
  carrito.splice(index, 1);
  guardarCarrito();
};

const cambiarCantidad = (index, cantidad) => {
  carrito[index].cantidad = Number(cantidad);
  guardarCarrito();
};

const vaciarCarrito = () => {
  carrito = [];
  guardarCarrito();
};

/* ========= ANIMACIÓN ========= */
const animarBoton = btn => {
  btn.classList.add("btn-success");
  btn.textContent = "✓ Añadido";

  setTimeout(() => {
    btn.textContent = "Añadir al carrito";
  }, 800);
};

/* ========= CHECKOUT ========= */
const checkout = () => {
  if (carrito.length === 0) return alert("El carrito está vacío");

  let mensaje = "🛒 *Pedido Susanoo 3D*%0A%0A";
  let total = 0;

  carrito.forEach(p => {
    mensaje += `• ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}%0A`;
    total += p.precio * p.cantidad;
  });

  mensaje += `%0A*Total:* $${total}`;

  // WhatsApp
  window.open(`https://wa.me/5493513353017?text=${mensaje}`, "_blank");

  // Email
  window.location.href =
    `mailto:susanoo.3d.ar@gmail.com?subject=Pedido Susanoo 3D&body=${mensaje}`;
};