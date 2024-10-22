#!/bin/bash

service mysql start

mysql -e "SET GLOBAL character_set_server = 'utf8mb4';"
mysql -e "SET GLOBAL collation_server = 'utf8mb4_unicode_ci';"

until mysqladmin ping >/dev/null 2>&1; do
    echo "Esperando a que MySQL se inicie..."
    sleep 2
done

for f in /docker-entrypoint-initdb.d/*.sql; do
    echo "Ejecutando script $f ..."
    mysql < "$f"
done

mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '${MYSQL_PASSWORD}'; FLUSH PRIVILEGES;"

/opt/tomcat/bin/catalina.sh run
