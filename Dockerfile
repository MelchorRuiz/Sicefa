# Usar la imagen base de Tomcat 9 (puedes cambiar la versión si es necesario)
FROM tomcat:10.1.30

# Establece la variable de entorno para que Tomcat elimine la aplicación predeterminada
ENV CATALINA_HOME /usr/local/tomcat
ENV PATH $CATALINA_HOME/bin:$PATH

# Agregar un argumento que se actualizará para invalidar la caché
ARG CACHEBUST=1

# Copia el archivo WAR de tu aplicación al directorio webapps de Tomcat
COPY ./dist/ROOT.war /usr/local/tomcat/webapps/

# Exponer el puerto 8080 para acceder a Tomcat
EXPOSE 8080

# Iniciar Tomcat
CMD ["catalina.sh", "run"]
