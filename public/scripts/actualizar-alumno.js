const formulario = document.getElementById('editar-alumno');

formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const imagenInput = document.getElementById('foto');
    const imagenSeleccionada = imagenInput.files[0];
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const correo = document.getElementById('correo').value;
    const intereses = document.getElementById('intereses').value;
    const habilidades = document.getElementById('habilidades').value;
    const objetivosCorto = document.getElementById('objetivosCorto').value;
    const objetivosLargo = document.getElementById('objetivosLargo').value;
    const comentarios = document.getElementById('comentarios').value;
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
  
    let validador = intereses+' '+objetivosLargo+' '+objetivosCorto+' '+comentarios+' '+habilidades;
    let matches = validador.match(/pito|pene|verga|vagina|puto/g);

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
            apellidos: apellidos,
            correo: correo,
            intereses: intereses,
            habilidades: habilidades,
            objetivosLargo: objetivosLargo,
            objetivosCorto: objetivosCorto,
            comentarios: comentarios,
            imagen: imageData,
            id: id
        };
        fetch('/actualizar-alumno', {
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
    
    if (typeof imagenSeleccionada !== 'undefined'){
        reader.readAsDataURL(imagenSeleccionada);
    }
    const mensaje = encodeURIComponent('Información actualizada con exito.');
    window.location.href = '/alumnos?message='+mensaje
});