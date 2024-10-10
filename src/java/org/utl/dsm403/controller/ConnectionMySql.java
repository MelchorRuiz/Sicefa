/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.controller;
     
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.SQLException;

/**
 *
 * @author Melchor Ruiz Gonzalez
 */
public class ConnectionMySql {
    
    // Variable para guardar el objeto de conexion
    private Connection connection = null;
    
    // Metodo para abrir la conexion
    public Connection openConnection() throws ClassNotFoundException, SQLException{
        Class.forName("com.mysql.cj.jdbc.Driver");
        
        String url = System.getenv("MYSQL_URL");
        String user = System.getenv("MYSQL_USER");
        String password = System.getenv("MYSQL_PASSWORD");
        
        connection = DriverManager.getConnection(url, user, password);
        return connection;
    }    
    
    // Metodo para cerrar la conexion
    public void closeConnection() throws SQLException{
        if (connection != null){
            connection.close();   
        } else {
            System.out.println("The connection has not been initiated");
        }
    }

}
