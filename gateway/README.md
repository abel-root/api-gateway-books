
## Description 
    The goals of this app is show how we can implement  API REST with the introduce the terme API Gateway

## Architectures
    root 
        # config-service
            *index.js
        #routres
            *index.js
    .gitignore
    package-lock.json
    package.json
    server.js // app server ( app input )
    README.md
## Description of app architure file
    # Root : is the root  of the appmication 
    # config-service : this folder  content all  microservice redirection 
    # rootes :  content all routes of each microservice :
                require("./routes")(app); use to call into the server.js
