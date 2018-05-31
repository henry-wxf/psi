# Pet Shelter API
A small demo of REST API - Pet Shelter API

- Create a pet

  POST /api/pets

  ```
  {
	"name":"wow",
	"type":"Dog",
	"breed":"woloo",
	"location":"Regina, SK",
	"latitude":"102.33",
	"longitude":89.55
  }
  ```

- List all pets

  GET /api/pets


- Get one pet by its ID

  GET /api/pets/1


## To set up on a local machine

- Download and Install Node.js https://nodejs.org/en/

- Checkout the latest code https://github.com/henry-wxf/psi.git

- Go to the psi directory and run
```
npm install
npm start
```
- Check http://localhost:5000/ to see if the service is running
- Play with the API endpoints with REST client, like Postman


## Play the live instance on [HeroKu](https://henry-pet-shelter-api.herokuapp.com)
