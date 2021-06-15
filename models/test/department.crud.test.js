const expect = require('chai').expect;
const mongoose = require('mongoose');
const Department = require('../department.model');

const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Department', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();
  
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    } catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    after(async () => {
      await Department.deleteMany();
    });

    before(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();
  
      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
    });
  
    it('should return all the data with "find" method', async () => {
      const departments = await Department.find();
      const expectLength = 2;

      expect(departments.length).to.be.equal(expectLength);
    });

    it('should return a proper document by "name" with "findOne" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      expect(department.name).to.be.equal('Department #1');
    });
  });

  describe('Creating data', () => {
    after(async () => {
      await Department.deleteMany();
    })

    it('should insert new document with "insertOne" method', async () => {
      // const department = new Department({ name: 'Department #1' });
      await Department.insertOne({ name: 'newDepartment' });
      // await department.save();
      // const saveedDepartment = await Department.findOne({ name: 'Department #1' });
      // expect(department.name).to.not.be.null;
      expect(department.isNew).to.be.false;
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();
    
      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
    });
    afterEach( async () => {
      await Department.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Department.updateOne({ name: 'Department #1' }, { $set: { name: '=Department #1=' }});
      const updatedDepartment = await Department.findOne({ name: '=Department #1=' });
      expect(updatedDepartment).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      department.name = '=Department #1=';
      await department.save();

      const updatedDepartment = await Department.findOne({ name: '=Department #1=' });
      expect(updatedDepartment).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Department.updateMany({}, { $set: { name: 'Department' }});
      const updatedDepartments = await Department.find();
      expect(updatedDepartments[0].name).to.be.equal('Department');
      expect(updatedDepartments[1].name).to.be.equal('Department');
      // or:
      expect(updatedDepartments.length).to.be.equal(2);
      // expect(updatedDepartments.name).to.be.equal('Department');
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();
    
      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
    });
    
    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Department.deleteOne({ name: 'Department #1' });
      const deletedDepartment = await Department.findOne({ name: 'Department #1' });

      expect(deletedDepartment).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      await department.remove();

      const removedDepartment = await Department.findOne({ name: 'Department #1' });
      expect(removedDepartment).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Department.deleteMany();
      const deletedDepatments = await Department.find();

      expect(deletedDepatments.length).to.be.equal(0);
    });
  });
});