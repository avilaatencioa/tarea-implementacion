# CRUD  API-plataform + graphql + react 
Comandos necesario para iniciar api y el cliente.

Instalando dependencias (Ir a la raiz del proyecto):
 cd .\api\
 composer install

 cd .\client\
 yarn install    or    npm install


Configurar Base de Datos MYSQL:
 Modificar la conexión a BD en el fichero \api\.env   (DATABASE_URL) 
 
 cd .\api\bin\
 php console doctrine:database:create
 php console doctrine:schema:update --force


Run api (Ir a la raíz del proyecto):  
 php -S localhost:8000 -t .\api\public\


Run cliente web (Ir a la raíz del proyecto): 
 cd .\client\
 npm start
