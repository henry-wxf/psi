import request from 'supertest';
import { expect, assert } from 'chai';

import app from '../src/app';
import router from '../src/router';

describe('Pet Shelter API', function() {

    it('GET an index of Pets', function(done) {
        request(app).get('/api/pets').expect(200).end(function(err, res) {
            const init_pet_number = 18;
            expect(res.body).to.have.lengthOf(init_pet_number);
            done();
        });
    });

    it('GET a pet by ID', function(done) {
        request(app).get('/api/pets/1').expect(200).end(function(err, res) {
            expect(res.body).to.have.property('pet_id', 1);
            done();
        });
    });

    describe('CREATE a pet', function() {
        const uri = '/api/pets';

        it('with valid parameter', function(done) {
            request(app)
                .post(uri)
                .send({
                    "name": "BeauCat",
                    "type": "Cat",
                    "breed": "woloo",
                    "latitude": 53.330987,
                    "longitude": -105757135
                })
                .expect(200)
                .end(function(err, res) {
                    assert.isNumber(res.body);
                    done();
                });
        });

        it('with empty info', function(done) {
            request(app)
                .post(uri)
                .send({})
                .expect(400)
                .end(function(err, res) {
                    done();
                });
        });

        it('with null name', function(done) {
            request(app)
                .post(uri)
                .send({
                    "name": "",
                    "type": "Cat",
                    "breed": "woloo",
                    "latitude": 53.330987,
                    "longitude": -105757135
                })
                .expect(400)
                .end(function(err, res) {
                    done();
                });
        });
    });
});