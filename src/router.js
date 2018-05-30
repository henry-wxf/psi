import petStore from './data/PetStore';
import express from 'express';

const router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log(`${Date.now()} ${req.method} ${req.originalUrl}`);
    next()
});

router.get('/', (req, res) => { res.send('Pet Shelter API is running') });

router.get('/api/pets', (req, res) => { res.json(petStore.getAllPets()) });

export default router;