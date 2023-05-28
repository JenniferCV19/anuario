const formulario = document.getElementById('registro-proyecto');

formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const imagenInput = document.getElementById('foto');
    const imagenSeleccionada = imagenInput.files[0];
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const autores = document.getElementById('autores').value;
    const evidencia = document.getElementById('evidencia').value;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let validador = descripcion+' '+autores+' '+evidencia+' '+nombre;
    let matches = validador.match(/pito|pene|verga|puto|vagina/g);

    if(matches !== null && matches.length > 0){
        alert('Favor de eliminar las malas palabras de los textos.');
        return false;
    }
    
    const reader = new FileReader();
    
    const tamanoMaximo = 60 * 1024; // 60KB en bytes
    if (typeof imagenSeleccionada !== 'undefined' && imagenSeleccionada.size > tamanoMaximo) {
      alert('La imagen excede el tamaño máximo permitido.');
      return;
    }

    reader.onloadend = () => {
        const imageData = reader.result;
        const requestBody = {
            nombre: nombre,
            descripcion: descripcion,
            autores: autores,
            imagen: imageData,
            evidencia: evidencia,
            id: id
        };
    
        fetch('/actualizar-proyecto', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.text())
        .catch(error => {
            return error;
        });
    };

    if(typeof imagenSeleccionada !== 'undefined'){
        reader.readAsDataURL(imagenSeleccionada);
    }

    const mensaje = encodeURIComponent('Información registrada con exito.');
    window.location.href = '/proyectos?message='+mensaje
});