"use strict"

const SUCCESS_RESPONSE = Object.freeze({
    TASK_CREATED: {
        title: "Tarea creada correctamente",
        message: "La tarea se ha creado con éxito. Ya puedes revisarla en tu lista de tareas!"
    }
});

const ERROR_RESPONSE = Object.freeze({
    TITLE_IS_REQUIRED: {
        title: "Datos incorrectos",
        message: "Este campo es obligatorio."
    },
    SERVER_ERROR: {
        title: "Error desconocido :(",
        message: "Se ha producido un error inesperado, vuelve a intentarlo en unos instantes."
    }
});

module.exports = {
    SUCCESS_RESPONSE: SUCCESS_RESPONSE,
    ERROR_RESPONSE: ERROR_RESPONSE
};