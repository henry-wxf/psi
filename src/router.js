import petStore from './data/PetStore';
import express from 'express';

const router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log(`${Date.now()} ${req.method} ${req.originalUrl}`);
    next()
});

router.get('/', (req, res) => { res.send('Pet Shelter API is running') });

router.get('/api/pets', (req, res) => {
    petStore.getAllPets()
        .then(rows => res.json(rows))
        .catch(errorHandler);
});

router.get('/api/pets/:petId', (req, res) => {
    petStore.getPetById(req.params.petId)
        .then(pet => res.json(pet))
        .catch(errorHandler);
});

const errorHandler = (err, res) => {
    console.error(err);
    res.sendStatus(500);
};

export default router;