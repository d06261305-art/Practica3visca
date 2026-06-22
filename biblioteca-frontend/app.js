const API_URL = "http://localhost:3000/libros";

const form = document.getElementById("formLibro");
const listaLibros = document.getElementById("listaLibros");
const busqueda = document.getElementById("busqueda");
const cancelar = document.getElementById("cancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const libroId = document.getElementById("libroId");

async function cargarLibros() {
  const q = busqueda.value.trim();
  const res = await fetch(`${API_URL}${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  const libros = await res.json();

  if (!libros.length) {
    listaLibros.innerHTML = "<p>No hay libros registrados.</p>";
    return;
  }

  listaLibros.innerHTML = libros
    .map(
      (libro) => `
        <article class="book-card">
          <div>
            <h3>${libro.titulo}</h3>
            <p class="meta">${libro.autor} - ${libro.genero} - ${libro.anio}</p>
            <p class="meta">Estado: ${libro.estado}</p>
          </div>
          <div class="row-actions">
            <button type="button" onclick='editarLibro(${JSON.stringify(libro)})'>Editar</button>
            <button type="button" class="danger" onclick="eliminarLibro('${libro._id}')">Eliminar</button>
          </div>
        </article>
      `
    )
    .join("");
}

function obtenerDatos() {
  return {
    titulo: document.getElementById("titulo").value.trim(),
    autor: document.getElementById("autor").value.trim(),
    genero: document.getElementById("genero").value.trim(),
    anio: Number(document.getElementById("anio").value),
    estado: document.getElementById("estado").value
  };
}

function limpiarFormulario() {
  form.reset();
  libroId.value = "";
  tituloFormulario.textContent = "Registrar libro";
}

window.editarLibro = function editarLibro(libro) {
  libroId.value = libro._id;
  document.getElementById("titulo").value = libro.titulo;
  document.getElementById("autor").value = libro.autor;
  document.getElementById("genero").value = libro.genero;
  document.getElementById("anio").value = libro.anio;
  document.getElementById("estado").value = libro.estado;
  tituloFormulario.textContent = "Actualizar libro";
};

window.eliminarLibro = async function eliminarLibro(id) {
  if (!confirm("Deseas eliminar este libro?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  cargarLibros();
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = libroId.value;

  await fetch(id ? `${API_URL}/${id}` : API_URL, {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obtenerDatos())
  });

  limpiarFormulario();
  cargarLibros();
});

cancelar.addEventListener("click", limpiarFormulario);
busqueda.addEventListener("input", cargarLibros);
cargarLibros();
