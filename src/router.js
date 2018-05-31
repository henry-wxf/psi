import petStore from './data/PetStore';
import express from 'express';
import InvalidParameter from './data/InvalidParameter';

const router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log(`${Date.now()} ${req.method} ${req.originalUrl}`);
    next()
});

router.get('/', (req, res) => { res.send('Pet Shelter API is running') });

router.get('/api/pets', (req, res) => {
    petStore.getAllPets()
        .then(rows => res.json(rows))
        .catch(errorHandler.bind(null, res));
});

router.post('/api/pets', (req, res) => {
    console.log(`Got request for creating pet %j`, req.body);
    petStore.createPet(req.body)
        .then(petId => res.json(petId))
        .catch(errorHandler.bind(null, res));
});

router.get('/api/pets/:petId', (req, res) => {
    petStore.getPetById(req.params.petId)
        .then(pet => res.json(pet))
        .catch(errorHandler.bind(null, res));
});

const errorHandler = (res, err) => {
    console.error(err);

    if (err instanceof InvalidParameter) {
        res.status(400).send(`${err.message} : ${JSON.stringify(err.input)}`);
    } else {
        res.sendStatus(500);
    }
};

export default router;