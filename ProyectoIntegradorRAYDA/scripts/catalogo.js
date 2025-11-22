document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("catalogo");

  fetch("../../backend/obtener_inventario.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data || data.length === 0) {
        contenedor.innerHTML = "<p>No hay productos en el inventario.</p>";
        return;
      }

      data.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <img src="../../assets/${producto.nombre}.jpg" alt="${producto.nombre}" />
          <h3>${producto.nombre}</h3>
          <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
          <p><strong>Ubicación:</strong> ${producto.lugar}</p>
          <button class="btn-agregar" data-id="${producto.id}" data-nombre="${producto.nombre}">
            ➕ Agregar a lista
          </button>
        `;

        contenedor.appendChild(card);
      });

      // Manejar eventos de "Agregar a lista"
      document.querySelectorAll(".btn-agregar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = String(e.currentTarget.dataset.id);
          const nombre = e.currentTarget.dataset.nombre;

          let lista = JSON.parse(localStorage.getItem("lista")) || [];

          // Si ya existe, incrementar cantidad; si no, agregar con cantidad 1
          const idx = lista.findIndex((p) => String(p.id) === id);
          if (idx !== -1) {
            lista[idx].cantidad = Number(lista[idx].cantidad) + 1;
            localStorage.setItem("lista", JSON.stringify(lista));
            showToast(`${nombre} cantidad: ${lista[idx].cantidad}`);
            return;
          }

          lista.push({ id, nombre, cantidad: 1 });
          localStorage.setItem("lista", JSON.stringify(lista));
          showToast(`${nombre} se agregó a la lista ✅`);
        });
      });
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
      contenedor.innerHTML = "<p>Error al cargar los productos.</p>";
    });
  
  // Pequeña notificación no bloqueante
  function showToast(message, duration = 1600) {
    const existing = document.querySelector('.app-toast');
    if (existing) existing.remove();

    const t = document.createElement('div');
    t.className = 'app-toast';
    t.textContent = message;
    document.body.appendChild(t);

    // aparecer -> desaparecer
    requestAnimationFrame(() => {
      t.style.opacity = '1';
    });

    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, duration);
  }
});
