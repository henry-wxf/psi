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
                latitude real NOT NULL,
                longitude real NOT NULL
       )`;

        const SQL_INSERT = `INSERT INTO pet (name, type, breed, latitude, longitude)
            VALUES ('Ajaxis', 'Dog', 'Beagle', 52.146973, -106.647034),
               ('Banshee', 'Dog', 'Brittany', 50.453753, -104.614343),
               ('Cosmo', 'Cat', 'Balinese', 51.017406, -106.344989),
               ('Daredevil', 'Dog', 'Pointer', 51.639001, -114.612116),
               ('Groot', 'Cat', 'Sphynx', 53.547338, -113.447565),
               ('Bansbloe', 'Dog', 'Chrittany', 50.453753, -104.614343),
               ('Duosmo', 'Cat', 'Wlinose', 51.017406, -106.344989),
               ('Darbcuil', 'Dog', 'Kiltt', 51.639001, -114.612116),
               ('Gjaot', 'Cat', 'Monx', 53.547338, -113.447565),
               ('Tolee', 'Dog', 'Brittany', 50.453753, -104.614343),
               ('Urrbie', 'Cat', 'Balinese', 58.017406, -116.344989),
               ('Hooge', 'Dog', 'Pointer', 51.639001, -144.612116),
               ('Mica', 'Cat', 'Sphynx', 59.547338, -113.447565),
               ('Julee', 'Dog', 'Chrittany', 50.89753, -108.67843),
               ('Feling', 'Cat', 'Wlinose', 51.017406, -121.344989),
               ('Boboo', 'Dog', 'Kiltt', 51.639001, -133.612116),
               ('Haloo', 'Cat', 'Monx', 68.547338, -113.447565),
               ('Hydra', 'Dog', 'Shiba', 54.246001, -105.757135)`;

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

        ['name', 'type', 'breed', 'latitude', 'longitude'].forEach(attr => {
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
                this.db.run(`INSERT INTO pet (name, type, breed, latitude, longitude)
                    VALUES (?, ?, ?, ?, ?)`, [pet.name, pet.type, pet.breed, pet.latitude, pet.longitude],
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