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


Play with it on [HeroKu](https://henry-pet-shelter-api.herokuapp.com)
