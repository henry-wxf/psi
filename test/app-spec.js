import request from 'supertest';
import { expect } from 'chai';

import app from '../src/app';
import router from '../src/router';

describe('Pet Shelter API', function() {

    it("GET an index of Pets", function(done) {
        var petsExpected = this.pets;
        request(app).get("/api/pets").expect(200).end(function(err, res) {
            done();
        });
    });
});