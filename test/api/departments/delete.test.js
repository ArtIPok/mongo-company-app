const chai = require('chai');
const chaiHttp = require('chai-http');
const Department = require('../../../models/department.model');
const server = require('../../../server');

chai.use(chaiHttp);

const request = chai.request;
const expect = chai.expect;

describe('DELETE /api/departments/:id', () => {
  before(async () => {
    const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
    await testDepOne.save();

    const testDepTwo = new Department({ _id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2' });
    await testDepTwo.save();
  });
  after(async () => {
    await Department.deleteMany();
  });

  it('should properly remove one document with "deleteOne" method', async () => {
    await Department.deleteOne({ _id: '5d9f1140f10a81216cfd4408' });
    const deletedDepartment = await Department.findOne({ _id: '5d9f1140f10a81216cfd4408' });
    expect(deletedDepartment).to.be.null;
  });
});