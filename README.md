
# Sicefa

![Sicefa](https://socialify.git.ci/MelchorRuiz/Sicefa/image?description=1&font=Rokkitt&language=1&name=1&owner=1&pattern=Solid&theme=Auto)

Proyecto Sistema Central de Farmacias, elaborado en la Universidad Tecnológica de León durante mis estudios en TSU Desarrollo de Software Multiplataforma


## ✨ Demo

### Enlace
[https://sicefa.onrender.com/](https://sicefa.onrender.com/)

### Sicefa Central
- Usuario: Administrador
- Contraseña: Administrador
### Sicefa Sucursal
- Usuario: Admins2
- Contraseña: Admins2


## 🖥️ Ejecución en un entorno local

Clona el proyecto

```bash
  git clone https://github.com/MelchorRuiz/Sicefa
```

Ve al directorio del proyecto

```bash
  cd Sicefa
```

Crea el archivo .war

```bash
  ant war
```

Crea la imagen Docker
```bash
   docker build -t sicefa .
```

Crea el contenedor Docker

```bash
  docker run -d -p 8080:8080 -e MYSQL_PASSWORD=root --name sicefa sicefa
```


## 🖼️ Screenshots

<img src="./screenshots/img_1.png" style="height: 50%; width:50%;">
<img src="./screenshots/img_2.png" style="height: 50%; width:50%;">
<img src="./screenshots/img_3.png" style="height: 50%; width:50%;">

