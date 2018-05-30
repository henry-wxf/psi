import pets from './pets';

class PetStore {
    getAllPets() {
        return pets;
    }

    savePet(pet) {}

    getPetByID() {
        return pets[0];
    }
}

const petStore = new PetStore();

export default petStore;