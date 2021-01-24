const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

// ---> DEBUT
/**
  * Génération des nouvelles couleurs et enregistrement de ces
  * couleurs dans un tableau.
  */
const newValues = []
const colorKey = 'NEW_COLOR_'
let nextCursor = 0;
const payloadColor = () => {
  const nextColor = `${colorKey}${nextCursor}`
  newValues.push(nextColor)
  nextCursor++;
  return { 'color': nextColor }
}
const getCurrentCulor = () => {
  return nextCursor > 0 ? `${colorKey}${nextCursor - 1}` : `${colorKey}O`
}
// <-- FIN

describe('GET /colors', () => {
	it('it should return all colors', (done) => {
		chai.request(app)
		.get('/colors')
		.end((err, res) => {
			res.should.have.status(200);
			res.should.to.be.json;
			res.body.should.be.a('object');
			res.body.results.should.be.a('array');
			res.body.results.should.be.eql(['RED', 'GREEN', 'BLUE']);
			done();
		});
	});
});

describe('GET /random-url', () => {
	it('it should return bad request', (done) => {
		chai.request(app)
		.get('/random-url')
		.end((err, res) => {
			res.should.have.status(404);
			done();
		});
	});
});

describe('POST /colors', () => {
	it('it should add new colors', (done) => {
		chai.request(app)
		.post('/colors')
		.set('content-type', 'application/json')
		.send(payloadColor())
		.end((err, res) => {
			res.should.have.status(201);
			res.body.should.be.a('object');
			res.body.results.should.be.a('array');
			res.body.results.should.include(getCurrentCulor());
			done();
		});
	});
});

describe('GET /colors', () => {
	it('it should return new color list', (done) => {
		chai.request(app)
		.get('/colors')
		.end((err, res) => {
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.results.should.be.a('array');
			res.body.results.should.include(getCurrentCulor());
			done();
		});
	});
});