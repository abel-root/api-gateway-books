#  Service User : Description
    The gaols  of this service is the créate user routes. This micro service is able to créete user, and do other action on them.

# Architecture 
    - config : micro service configuration 
    - migrations : content all models migration, used to créate data table on the database
    - models : content all models of the app
    - routes : content the routes of all action, it is possible to do it 
    - seedrs 
    - app.js : app input 
    - package-lock.json
    - package.json

## models 
    - User : content user attributes ( name , tels, email, password etc.)
    - Books : content user books attributes  (name, userId, )
### models description 

    - User :
        - One use can have one and many books
        - One book can writted by one and many user
        - User Table is associate on  many Books

    -  Books :
        - 
## Routes 
    - index.js : it content all routes of the app  ( get , post , put , delete)
