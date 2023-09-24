## 2. Resumen del proyecto

En este proyecto desarrollarás una librería en Node.js que funcionará como
herramienta para analizar links dentro de archivos Markdown. Esta librería
estará disponible de dos formas: como un módulo publicado en GitHub, que las
usuarias podrán instalar e importar en otros proyectos, y como una interfaz
de línea de comandos (CLI) que permitirá utilizar la librería directamente
desde el terminal.

[Node.js](https://nodejs.org/es/) es un entorno de ejecución para JavaScript
construido con el [motor de JavaScript V8 de Chrome](https://developers.google.com/v8/).
Esto nos va a permitir ejecutar JavaScript en el entorno del sistema operativo,
ya sea tu máquina o un servidor, lo cual nos abre las puertas para poder
interactuar con el sistema en sí, archivos, redes, etc.

En esta oportunidad nos alejamos un poco del navegador para construir una
librería que interactua con el sistema archivos y un script que se ejecute
usando Node.js. Aprenderemos cómo buscar y leer archivos, cómo hacer consultas
de red, sobre procesos (`process.env`, `process.argv`, ...), etc.

Diseñar tu propia librería es una experiencia fundamental para cualquier
desarrolladora porque que te obliga a pensar en la interfaz (API) de tus
_módulos_ y cómo será usado por otras developers. Debes tener especial
consideración en peculiaridades del lenguaje, convenciones y buenas prácticas.
Al finalizar, podrás instalar esta librería utilizando NPM (Node Package
Manager), que facilita la búsqueda e instalación de librerías de Node a
través de su registro y también de GitHub. Una vez que hayas subido la
librería a tu repositorio público, será accesible para otras developers.
