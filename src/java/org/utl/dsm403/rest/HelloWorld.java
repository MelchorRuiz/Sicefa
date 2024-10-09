package org.utl.dsm403.rest;

import jakarta.ws.rs.Path;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Produces;

@Path("/")
public class HelloWorld {
  @GET
  @Produces("text/plain")
  public String getHello() {
    return "Hello World!";
  }
}