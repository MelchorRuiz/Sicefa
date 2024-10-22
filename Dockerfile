FROM ubuntu:20.04

ENV MYSQL_DATABASE="sicefa"
ENV MYSQL_URL="jdbc:mysql://127.0.0.1:3306/$MYSQL_DATABASE?useSSL=false&serverTimezone=UTC"
ENV MYSQL_USER="root"
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y software-properties-common

RUN add-apt-repository ppa:openjdk-r/ppa -y && apt-get update
RUN apt-get install -y openjdk-17-jdk mysql-server wget

RUN wget https://dlcdn.apache.org/tomcat/tomcat-10/v10.1.31/bin/apache-tomcat-10.1.31.tar.gz
RUN tar xzvf apache-tomcat-10.1.31.tar.gz -C /opt
RUN mv /opt/apache-tomcat-10.1.31 /opt/tomcat
RUN rm apache-tomcat-10.1.31.tar.gz
RUN rm -rf /opt/tomcat/webapps/*

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
ENV PATH="$JAVA_HOME/bin:$PATH"

COPY ./dist/ROOT.war /opt/tomcat/webapps/
COPY ./db/ /docker-entrypoint-initdb.d/

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]