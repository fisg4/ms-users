# Users MS


<!-- CONTRIBUTING -->
# FIS DOCUMENTATION

## Project finish level

Level 9 of the requirements sheet

## Application description

FastMusik es un punto de encuentro para los amantes de la música donde los usuarios pueden buscar sus canciones favoritas y encontrar otras nuevas, conocer datos interesantes de cualquier single, dar like a aquellos que más te gusten, conversar con otros usuarios con tus mismos gustos musicales y todo ello navegando con seguridad gracias al sistema de soporte

El proyecto se ha desarrollado usando como stack tecnológico el conocido como MERN (Mongo, Express, React y Nodejs). En el apartado de despliegue e integración continua, se utilizaron Jest, Github Actions y Okteto. Por último, para la gestión del código se ha utilizado una organización de Github con multi-repo y usando Github Flow para los cambios. 

## Microservice descomposition

La aplicación se divide en 5 microservicios: canciones, usuarios, mensajería, soporte y, por último, una API Gateway. Todos ellos se integran a través del backend para compartir y completar la información. Estos se integran a su vez con APIs externas como DeepL, Spotify, SendGrid y PurgoMalum. Se deben comentar las características de la API Gateway, como su función de centralizadora de operaciones y para la autenticación de usuarios

### Microservicio de usuarios

El modelado de datos de este microservicio se basa en una única entidad, llamada Usuarios, que contiene toda la información necesaria para la gestión de los mismos. Con ella se presentan las siguientes funcionalidades: operaciones CRUD de la entidad, gestión de credenciales, registro y control de usuarios en los clientes y comprobación de texto ofensivo. Como puntos destacables, está el uso de una API externa, PurgoMalum, para comprobar los textos que se introducen en el sistema; la autenticación que permite el control de la sesión del usuario y la centralización de la información de los usuarios.

### Microservicio de canciones

El modelado de datos de este microservicio se basa en las entidades de Likes y Canciones, las cuales contienen toda la información necesaria para almacenar la música. Este servicio presenta funcionalidades como la obtención de canciones desde Spotify, un sistema colaborativo de información de canciones, operaciones CRUD de las entidades y reproducción multimedia. Como puntos destacables, está el uso de la API de Spotify para alimentar la base de datos propia y la integración con otros microservicios para mostrar los gustos de los usuarios y el envío automático de correcciones en los errores de información

### Microservicio de mensajes

El modelado de datos de este microservicio se basa en las entidades de Salas y Mensajes, las cuales contienen toda la información para posibilitar las conversaciones entre usuarios del sistema. Este servicio presenta funcionalidades como la recuperación de entidades con paginación, la traducción del texto de los mensajes, las operaciones CRUD de ambas entidades y el reporte de mensajes ofensivos. Como puntos destacables, el uso de la API externa de DeepL para la traducción y la integración interna para los reportes usando mecanismos de rollback ante fallos.

### Microservicio de soporte

El modelado de datos de este microservicio se basa en las entidades de Tickets y Reports, las cuales contienen toda la información necesaria para mantener el control y el buen funcionamiento del sistema. Este servicio presenta funcionalidades como el envío de notificaciones a los usuarios, las operaciones CRUD con las entidades y la gestión de incidencias. Como puntos destacables están el uso de una API externa para enviar correos, la tolerancia a fallos desplegando un cliente aparte para la gestión de incidencias y el mecanismo de rollback incluido en la integración con los diferentes microservicios.

### Aspectos relevantes

Como aspectos relevantes de la aplicación en general se tiene el despliegue en un mismo cliente con rutas y navegación, el uso de Redux en gran parte del frontend, la cobertura de varios componentes de la interfaz de usuario, la documentación mediante swagger de todas las APIs, el uso de una API Gateway que controla la autenticación de los usuarios y, por último, el despliegue común en un mismo namespace de Oktet

## Customer agreement

El CA se puede encontrar directamente en la [aplicación desplegada](https://fastmusik-fastmusik-marmolpen3.cloud.okteto.net/customer-agreement)

## Capacity analysis

El análisis de la capacidad se puede encontrar [aquí](https://github.com/fisg4/client/wiki/An%C3%A1lisis-de-la-capacidad)

## REST description

Toda la información relevante de las operaciones REST de la API está disponible [aquí](https://users-fastmusik-marmolpen3.cloud.okteto.net/api-docs)

Los endpoints definidos son los siguientes:

| Operación          	| Permiso 	| Endpoint       	|
|--------------------	|---------	|----------------	|
| GET ALL            	| ---     	| /users         	|
| GET BY USER ID     	| ---     	| /users/:userId 	|
| POST NEW USER      	| ---     	| /users         	|
| PUT USER BY ID     	| ---     	| /users/:userId 	|
| DELETE USER BY ID  	| ---     	| /users/:userId 	|
| POST USER LOGIN    	| ---     	| /users/login   	|
| GET ALL USER LIKES 	| ---     	| /likes/all     	|
| POST LIKE          	| ---     	| /likes         	|
| DELETE LIKE        	| ---     	| /likes/:likeId 	|

## Requirements description

### Nivel hasta 5 puntos

✔️ - Microservicio básico completamente implementado.

  - El backend debe ser un API REST tal como se ha visto en clase implementando al menos los métodos GET, POST, PUT y DELETE y devolviendo un conjunto de códigos de estado adecuado. → Dicho backend se puede encontrar en el código fuente de este repositorio.

  - La API debe tener un mecanismo de autenticación. → Se utilizó JWT para realizar la autenticación en la API Gateway.

  - Debe tener un frontend que permita hacer todas las operaciones de la API (este frontend puede ser individual o estar integrado con el resto de frontends). → Se utilizó un <a href="https://github.com/fisg4/client">Frontend común</a>.

  - Debe estar desplegado y accesible en la nube. → Accesible desde [aquí](https://users-fastmusik-marmolpen3.cloud.okteto.net/)

  - La API que gestione el recurso también debe ser accesible en una dirección bien versionada. → La ruta de la API está bien versionada: se especifica tras el hostname (y puerto en caso de ser en local), el texto _api/v1_, indicando que es la primera versión de la API. <br> Esta versión es seguida del resto del endpoint que dependerá de la operación que queramos hacer sobre un recurso concreto; i.e. si queremos hacer una llamada que realice una operación sobre users, llamaremos a _api/v1/users_ seguido del endpoint necesario para realizar la acción.

  - Se debe tener una documentación de todas las operaciones de la API incluyendo las posibles peticiones y las respuestas recibidas. → Nuevamente, referencia a <a href="https://users-fastmusik-marmolpen3.cloud.okteto.net/api-docs/#/">Swagger</a>.

  - Debe tener persistencia utilizando MongoDB u otra base de datos no SQL. → Se utilizó MongoDB para la persistencia de datos.

  - Deben validarse los datos antes de almacenarlos en la base de datos (por ejemplo, haciendo uso de mongoose). → Se ha utilizado _mongoose_ para la validación de los datos antes de almacenarlos. Esto, se puede ver en el modelo de la entidad User.

  - Se debe utilizar gestión del código fuente y mecanismos de integración continua: o El código debe estar subido a un repositorio de Github siguiendo Github flow o El código debe compilarse y probarse automáticamente usando GitHub Actions u otro sistema de integración continua en cada commit.

  - Debe haber definida una imagen Docker del proyecto.

  - Debe haber pruebas de componente implementadas en Javascript para el código del backend utilizando Jest y pruebas de integración con la base de datos. → Dichas pruebas se encuentran <a href="https://github.com/fisg4/ms-messages/tree/main/tests">aquí</a>.

✔️ - Diseño de un customer agreement para la aplicación en su conjunto con dos planes de precios que considere características funcionales y extrafuncionales. Este diseño debe contemplar el uso de SendGrid o algún otro servicio externo con un plan de precios múltiple.

✔️ - Este documento que se está leyendo actualmente.

✔️ - Vídeo demonstración de la aplicación en funcionamiento.

✔️ - Presentación de la aplicación.

### Nivel hasta 7 puntos

✔️  - Todos los requisitos del nivel hasta 5 puntos

✔️  - Aplicación basada en microservicios básica implementada, i.e. la interacción completa entre todos los microservicios → Esto se ha logrado con llamadas a los distintos endpoints, siguiendo el esquema de la aplicación. Asimismo, a través de la API Gtateway

✔️  - Análisis de límites de capacidad del customer agreement asumiendo que esto no tiene implicaciones en el precio.

✔️ - Al menos 3 de las características del microservicio avanzado implementados.

Se han implementado las siguientes características:

  -  Implementar un frontend con rutas y navegación, utilizando _react-router-dom_

  -  Implementar pruebas en la interfaz de usuario.

  -  Implementar cachés para optimizar el acceso a datos de otros recursos.

  -  Consumir alguna API externa. Se utilizó Purgo Malum API para la comprobación de texto ofensivo.

  -  Implementar un mecanismo de autenticación basado en JWT.

### Nivel hasta 9 puntos

✔️ - Todos los requisitos del nivel hasta 7 puntos

✔️ - Un mínimo de 20 pruebas incluyendo casos positivos y negativos. → El con junto de pruebas se puede encontrar <a href="https://github.com/fisg4/ms-users/tree/master/tests">aquí</a>.

✔️ - Justificación del coste de cada plan del customer agreement.

✔️ - Tener el API REST documentado con <a href="https://users-fastmusik-marmolpen3.cloud.okteto.net/api-docs/#/">Swagger</a>.

✔️ - Al menos 5 de las características del microservicio avanzado implementados.

Se han implementado las siguientes características:

  -  Implementar un frontend con rutas y navegación, utilizando _react-router-dom_

  -  Implementar pruebas en la interfaz de usuario.

  -  Implementar cachés para optimizar el acceso a datos de otros recursos.

  -  Consumir alguna API externa. Se utilizó Purgo Malum API para la comprobación de texto ofensivo.

  -  Implementar un mecanismo de autenticación basado en JWT.

✔️ - Al menos 3 de las características de la aplicación basada en microservicios avanzada implementados, que son:

Se han implementado las siguientes características:

  -  Frontend común en el [cliente](https://github.com/fisg4/client)

  -  Hacer uso de un [API Gateway](https://github.com/fisg4/api-gateway)

  -  IImplementación de un mecanismo de autenticación homogéneo para todos los microservicios (¡somos nosotros!)

## Effort analysis

El análisis en horas de cada miembro se puede encontrar [aquí](https://github.com/fisg4/ms-users/tree/master/fis-docs)

<!-- ABOUT THE PROJECT -->
## About The Project
The User MS is responsible for managing all connection requests to the application for the authentication of personal data of the application users. Specifically, it will process user connections to maintain a history of their data, songs and reports.

## Built With

* [Node.JS](https://nodejs.org/)
* [Express.JS](https://expressjs.com/)
* [MongoDB Atlas](https://www.mongodb.com/atlas/database)
* [Docker](https://www.docker.com/)
* [Okteto](https://www.okteto.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Documentation
All relevant API usage documentation is defined in the Wiki section within the repository. Can be accesed through [here](https://github.com/fisg4/ms-users/wiki). Expect information about:

API definition
* [Entities](https://github.com/fisg4/ms-users/wiki/API-Definition#entities)
* [CRUD](https://github.com/fisg4/ms-users/wiki/API-Definition#crud)

Endpoints
1. GET
2. CREATE
4. PUT
5. DELETE

Integration 
* [Internal](https://github.com/fisg4/ms-users/wiki/API-Definition#integration-with-internal-apis)
* [External](https://github.com/fisg4/ms-users/wiki/API-Definition#integration-with-external-apis)

Installation
* [Localhost](https://github.com/fisg4/ms-users/wiki/Installation#localhost)
* [Cloud](https://github.com/fisg4/ms-users/wiki/Installation#cloud)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>
