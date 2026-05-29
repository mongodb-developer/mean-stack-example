import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cors from 'cors';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db } from 'mongodb';

import { employeeRouter } from '../src/employee.routes';
import { collections } from '../src/database';
import { Employee } from '../src/employee';

let mongoServer: MongoMemoryServer;
let mongoClient: MongoClient;
let db: Db;

const app = express();
app.use(cors());
app.use(express.json());
app.get('/healthcheck', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/employees', employeeRouter);

const api = request(app);

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoClient = new MongoClient(mongoServer.getUri(), {
    appName: 'mean-stack-example-integration-tests',
  });

  await mongoClient.connect();
  db = mongoClient.db('meanStackExample');
  collections.employees = db.collection<Employee>('employees');
});

test.after(async () => {
  await mongoClient.close();
  await mongoServer.stop();
});

test.beforeEach(async () => {
  await collections.employees?.deleteMany({});
});

test('GET /healthcheck returns ok', async () => {
  const response = await api.get('/healthcheck');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('employee CRUD flow works end-to-end', async () => {
  const newEmployee: Employee = {
    name: 'Integration User',
    position: 'QA Engineer',
    level: 'mid',
  };

  const createResponse = await api.post('/employees').send(newEmployee);
  assert.equal(createResponse.status, 201);

  const listResponse = await api.get('/employees');
  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.length, 1);
  assert.equal(listResponse.body[0].name, 'Integration User');

  const employeeId = listResponse.body[0]._id;

  const getResponse = await api.get(`/employees/${employeeId}`);
  assert.equal(getResponse.status, 200);
  assert.equal(getResponse.body.position, 'QA Engineer');

  const updateResponse = await api.put(`/employees/${employeeId}`).send({
    name: 'Integration User',
    position: 'Senior QA Engineer',
    level: 'senior',
  });
  assert.equal(updateResponse.status, 200);

  const updatedGetResponse = await api.get(`/employees/${employeeId}`);
  assert.equal(updatedGetResponse.status, 200);
  assert.equal(updatedGetResponse.body.level, 'senior');

  const deleteResponse = await api.delete(`/employees/${employeeId}`);
  assert.equal(deleteResponse.status, 202);

  const missingResponse = await api.get(`/employees/${employeeId}`);
  assert.equal(missingResponse.status, 404);
});
