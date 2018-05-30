import sqlite3 from 'sqlite3';

class PetStore {
    constructor() {
        sqlite3.verbose();

        // open database in memory
        this.db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the in-memory SQlite database.');
        });

        this.dbInit();

        const exitHandler = () => {
            this.db.close((err) => {
                logErrorOrInfo(err, 'database connection was closed succefully.');
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
            VALUES ('Ajaxis', 'Dog', 'Beagle', 305.33, 110.67),
               ('Banshee', 'Dog', 'Brittany', 855.33, 119.67),
               ('Cosmo', 'Cat', 'Balinese', 905.63, 510.55),
               ('Daredevil', 'Dog', 'Pointer', 355.37, 190.08),
               ('Groot', 'Cat', 'Sphynx', 395.38, 110.67),
               ('Hydra', 'Dog', 'Shiba', 405.33, 170.22)`;

        this.db.serialize(() => {
            this.db.run(SQL_CREATE_TABLE, (err) => logErrorOrInfo(err, 'pet table was created.'))
                .run(SQL_INSERT, (err) => logErrorOrInfo(err, 'records were created.'));
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
}

const logErrorOrInfo = (err, info) => {
    if (err) {
        console.error(err);
    } else {
        console.log(info);
    }
};

export default new PetStore();