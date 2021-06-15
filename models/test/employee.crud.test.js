const expect = require('chai').expect;
const mongoose = require('mongoose');
const Employee = require('../employee.model');
const Department = require('../department.model');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getUri();
  
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    } catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    after(async () => {
      await Employee.deleteMany();
    });

    before(async () => {
      const testEmpOne = new Employee({ firstName: 'firstName #1', lastName: 'lastName #1', department: 'Department #1', salary: 2000 });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'firstName #2', lastName: 'lastName #2', department: 'Department #2', salary: 2000 });
      await testEmpTwo.save();

      const testDepartment = new Department({ name: 'IT' })
      const testEmpThree = new Employee({ firstName: 'firstName #3', lastName: 'lastName #3', department: testDepartment._id, salary: 3000 });
      await testEmpThree.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectLength = 3;

      expect(employees.length).to.be.equal(expectLength);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const testEmpFirstName = await Employee.findOne({ firstName: 'firstName #1' });
      const testEmpLastName = await Employee.findOne({ lastName: 'lastName #2' });
      const testEmpDepartment = await Employee.findOne({ department: 'Department #1' });
      const testEmpSalary = await Employee.findOne({ salary: 3000 });

      expect(testEmpFirstName.firstName).to.be.equal('firstName #1');
      expect(testEmpLastName.lastName).to.be.equal('lastName #2');
      expect(testEmpDepartment.department).to.be.equal('Department #1');
      expect(testEmpSalary.salary).to.be.equal(3000);
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      await Employee.insertOne({ firstName: 'Art', lastName: 'Pok', department: 'Mark', salary: 4000 });
      // const newEmployee = new Employee({ firstName: 'Art', lastName: 'Pok', department: 'Mark', salary: 4000 });
      // await newEmployee.save();
      expect(newEmployee.isNew).to.be.false;
    });
  });

  describe('Updating data', () => {
    after(async () => {
      await Employee.deleteMany();
    });

    before(async () => {
      const testEmpOne = new Employee({ firstName: 'firstName #1', lastName: 'lastName #1', department: 'Department #1', salary: 2000 });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'firstName #2', lastName: 'lastName #2', department: 'Department #2', salary: 2000 });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'firstName #1' }, { $set: { firstName: '=firstName #1=' }});
      const updatedEmployee = await Employee.findOne({ firstName: '=firstName #1=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const testEmployee = await Employee.findOne({ lastName: 'lastName #2' });
      testEmployee.lastName = '=lastName #1=';
      await testEmployee.save();

      const updatedEmployee = await Employee.findOne({ lastName: '=lastName #1=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { department: 'IT' } });
      const employees = await Employee.find();
      expect(employees[0].department).to.be.equal('IT');
      expect(employees[1].department).to.be.equal('IT');
      // expect(employees.department).to.be.equal('IT');
    });
  });

  describe('Removing data', () => {
    after(async () => {
      await Employee.deleteMany();
    });

    before(async () => {
      const testEmpOne = new Employee({ firstName: 'firstName #1', lastName: 'lastName #1', department: 'Department #1', salary: 2000 });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'firstName #2', lastName: 'lastName #2', department: 'Department #2', salary: 2000 });
      await testEmpTwo.save();
    });

    it|('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'firstName #2' });
      const deletedEmployee = await Employee.findOne({ firstName: 'firstName #2' });
      expect(deletedEmployee).to.be.null;
    });

    it ('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'firstName #1' });
      await employee.remove();
      
      const deletedEmployee = await Employee.findOne({ firstName: 'firstName #1' });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const deletedEmployees = await Employee.find();
      expect(deletedEmployees.length).to.be.equal(0)
    });
  });    
});