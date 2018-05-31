import sqlite3 from 'sqlite3';
import InvalidParameter from './InvalidParameter';

class PetStore {
    constructor() {
        sqlite3.verbose();

        // open database in memory
        this.db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                log(err);
                return;
            }
            console.log('Connected to the in-memory SQlite database.');
        });

        this.dbInit();

        const exitHandler = () => {
            this.db.close((err) => {
                log(err, 'database connection was closed succefully.');
                process.exit();
            });
        }

        process.on('beforeExit', exitHandler.bind(null));
    }

    dbInit() {
        const SQL_CREATE_TABLE = `
            CREATE TABLE pet (
                pet_id INTEGER PRIMARY KEY,
                name text NOT NULL,
                type text NOT NULL,
                breed text NOT NULL,
                location text NOT NULL,
                latitude real NOT NULL,
                longitude real NOT NULL
       )`;

        const SQL_INSERT = `INSERT INTO pet (name, type, breed, location, latitude, longitude)
            VALUES ('Ajaxis', 'Dog', 'Beagle', 'Boston, MA', 305.33, 110.67),
               ('Banshee', 'Dog', 'Brittany', 'Regina, SK', 855.33, 119.67),
               ('Cosmo', 'Cat', 'Balinese', 'Saskatoon, SK', 905.63, 510.55),
               ('Daredevil', 'Dog', 'Pointer', 'Toronoto, ON', 355.37, 190.08),
               ('Groot', 'Cat', 'Sphynx', 'Calgary, AB', 395.38, 110.67),
               ('Hydra', 'Dog', 'Shiba', 'Edmondon, AB', 405.33, 170.22)`;

        this.db.serialize(() => {
            this.db.run(SQL_CREATE_TABLE, (err) => log(err, 'pet table was created.'))
                .run(SQL_INSERT, (err) => log(err, 'records were created.'));
        });
    }

    getAllPets() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM pet', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getPetById(petId) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM pet WHERE pet_id = ?`, [petId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    _checkParams(pet, reject) {
        if (!pet) {
            reject(new InvalidParameter(pet, 'no pet info'));
        }

        ['name', 'type', 'breed', 'location', 'latitude', 'longitude'].forEach(attr => {
            if (!pet[attr]) {
                reject(new InvalidParameter(pet, `${attr} is required`));
            }
        });
    }

    createPet(pet) {
        return new Promise((resolve, reject) => {
            this._checkParams(pet, reject);

            console.log(`before create pet with %j`, pet);

            const _doCreate = (pet, resolve, reject) => {
                this.db.run(`INSERT INTO pet (name, type, breed, location, latitude, longitude)
                    VALUES (?, ?, ?, ?, ?, ?)`, [pet.name, pet.type, pet.breed, pet.location, pet.latitude, pet.longitude],
                    function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(`a pet was created ${this.lastID}`);
                            resolve(this.lastID);
                        }
                    }
                );
            }

            this.db.get(`SELECT COUNT(*) AS count FROM pet WHERE name = ? AND breed = ?`, [pet.name, pet.breed],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (row.count > 0) {
                        reject(new InvalidParameter(pet, 'same pet exists'));
                    } else {
                        _doCreate(pet, resolve, reject);
                    }
                }
            );
        });
    }
}

const log = (err, info) => {
    if (err) {
        console.error(err);
    } else {
        console.log(info);
    }
};

export default new PetStore();