# Documentacion General del Proyecto

## Identificacion Academica

- Nombre del estudiante: Daniel Luna
- Carrera / codigo: 21041
- Asunto: Tesis Lux Producciones

## Descripcion General

Lux Producciones corresponde a una aplicacion web desarrollada con Next.js, React y TypeScript, orientada a la presentacion visual de perfiles premium denominados "vedetos". El proyecto articula una propuesta grafica de caracter editorial, con una paleta cromatica oscura de base violeta-negra y acentos dorados, buscando transmitir una identidad de lujo, exclusividad y coherencia visual.

Desde una perspectiva funcional, el sistema permite:

- visualizar perfiles individuales;
- filtrar vedetos segun criterios definidos por la empresa;
- navegar entre secciones institucionales;
- explorar conjuntos y formatos grupales;
- simular procesos de reserva y contacto.

## Objetivo Tecnico

El objetivo tecnico de la aplicacion es consolidar una plataforma de exhibicion y navegacion para perfiles comerciales, priorizando:

- claridad de informacion;
- continuidad estetica entre secciones;
- adaptabilidad a dispositivos moviles;
- reutilizacion de componentes;
- facilidad de mantenimiento y futura ampliacion.

## Arquitectura del Proyecto

La estructura principal del sistema se organiza en tres capas:

### 1. Capa de rutas (`app/`)

En esta capa se definen las paginas principales del sitio, incluyendo:

- inicio;
- vedetos;
- conjuntos;
- nosotros;
- contacto;
- checkout;
- detalle individual de cada vedeto.

La carpeta `app/` utiliza el App Router de Next.js, lo que permite una organizacion modular por pagina y por segmento de ruta.

### 2. Capa de componentes (`components/`)

Aqui se encapsula la logica visual reutilizable del proyecto. Entre los componentes mas relevantes se encuentran:

- `Navbar`: navegacion principal;
- `HeroSection`: portada con video, tipografia destacada y particulas doradas;
- `FeaturedVedetos`: carrusel de perfiles destacados;
- `EditorialShowcase`: bloques editoriales "Contrata Uno / Dos / Tres";
- `VedetoCard`: tarjeta individual para representar cada perfil;
- `Footer`: cierre institucional con redes sociales y enlaces legales;
- `GoldParticles`: capa reutilizable de particulas decorativas;
- `ContactSection` y `AboutSection`: secciones informativas reutilizadas en paginas internas.

### 3. Capa de datos y utilidades (`lib/`)

Esta capa concentra:

- tipos de datos TypeScript;
- datos simulados de perfiles (`mock-data.ts`);
- funciones auxiliares.

Su funcion es desacoplar la informacion del renderizado visual, facilitando la mantencion y la posterior migracion a una fuente de datos real.

## Criterios de Diseno

La propuesta visual del sistema se sustenta en los siguientes criterios:

- predominio de fondos oscuros para aumentar contraste y sofisticacion;
- uso de acentos dorados para resaltar elementos clave;
- tipografia serif para jerarquia editorial y elegancia;
- animaciones suaves para enriquecer la experiencia sin saturar la interfaz;
- composiciones responsivas para asegurar legibilidad en dispositivos moviles.

## Responsividad

Se implementaron clases responsivas mediante Tailwind CSS, con el fin de:

- reducir tipografias en pantallas pequenas;
- reorganizar columnas en disposicion vertical cuando el ancho disponible lo exige;
- compactar espaciados e iconografia en vistas moviles;
- preservar la armonia visual del sitio en diferentes resoluciones.

## Datos y Modelado

Los perfiles de vedetos se modelan mediante la interfaz `Vedeto`, que contiene:

- identificador;
- nombre;
- slug de navegacion;
- descripcion breve y extensa;
- imagen principal y galeria;
- calificacion;
- numero de resenas;
- planes de precio;
- disponibilidad;
- ubicacion;
- etiquetas tematicas;
- estado de destacado.

Este modelado permite reutilizar la misma informacion en:

- el inicio;
- el listado general;
- las tarjetas visuales;
- la vista individual;
- futuras secciones como conjuntos o reservas.

## Consideraciones para la Tesis

Con fines academicos, se recomienda presentar este proyecto como una solucion de interfaz digital centrada en:

- experiencia de usuario;
- identidad visual consistente;
- arquitectura modular en frontend;
- escalabilidad de componentes;
- documentacion de decisiones tecnicas y esteticas.

Se deja constancia de que las dependencias externas ubicadas en `node_modules` no forman parte de la autoria directa del estudiante, por lo que la documentacion principal se concentra en el codigo fuente propio del proyecto.

## Cierre

La aplicacion Lux Producciones constituye una base funcional y visualmente coherente para el desarrollo de una plataforma comercial de exhibicion de perfiles. Su estructura modular permite continuar iterando el sistema, incorporar nuevas funcionalidades y justificar, desde una perspectiva universitaria, decisiones de arquitectura, diseno y experiencia de usuario.
