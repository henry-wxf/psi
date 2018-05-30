import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app';
import petStore from '../src/data/PetStore';

describe('Pet Shelter API', function() {

    beforeEach(function() {

        this.pets = [{
                name: 'Ajaxis',
                type: 'Dog',
                breed: 'Beagle'
            },
            {
                name: 'Groot',
                type: 'Cat',
                breed: 'Shiba'
            }
        ];

        petStore.__set__("pets", this.pets);
    });

    it("GET an index of Pets", function(done) {
        var petsExpected = this.pets;
        request(app).get("/api/pets").expect(200).end(function(err, res) {
            var petsFromRes = JSON.parse(res.text);
            expect(petsFromRes).to.deep.equal(petsExpected);
            done();
        });
    });

});