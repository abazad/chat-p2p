## Chat p2p ##

### Comandos para interactuar con el servidor ###
	
***
	

- **Create** nos permite conectarnos con el servidor. 

	```
	create "nombreUsuario" "contraseña"
	```

	- Error: Usuario ya existente  
	
***
 
	


- **Connnect** conectarse con el servidor.

	```
	connect "nombreUsuario" "contraseña"
	```

	- Error: Usuario no existe.
	- Error: No coincide el pass.  
 	
***

- **List** nos devuelve una lista con los usuarios.

  ```
  list
  ```
  	
***
  
- **Get** obtener ip y puerto de un usuario.

  ```
  get "nombreUsuario"
  ```
  
  - Error: Usuario no existente
  	
***
	
- **Delete** Eliminas tu usuario.

  ```
  delete "nombreUsuario" "contraseña"
  ```
  
  - Error: Contraseña incorrecta
  	
***
	
- **Changepass** Cambias el pass de tu usuario.

  ```
  changepass "nombreUsuario" "contraseña" "nuevacontraseña"
  ```
  
  - Error: Contraseña incorrecta  
  	
***
