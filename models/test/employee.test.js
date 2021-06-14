const expect = require('chai').expect;
const mongoose = require('mongoose');
const Employee = require('../employee.model');

describe('Employee', () => {
  after(() => {
    mongoose.models = {};
  });

  it('should throw an error if any arg is missing', () => {
    const cases = [
      {
        firstName: 'Art',
        department: 'IT',
        salary: 3000,
      },
      {
        lastName: 'Pok',
        department: 'IT',
        salary: 2000,
      },
      {
        firstName: 'Art',
        lastName: 'Pok',
        salary: 3000,
      },
      {
        firstName: 'Art',
        lastName: 'Pok',
        department: 'IT',
      },
    ]

    for(let test of cases) {
      const emp = new Employee(test);
      emp.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if "firstName" arg is not a string', () => {
    const cases = [{}, []];

    for(let test of cases) {
      const emp = new Employee({ firstName: test, lastName: 'Pok', department: 'IT' });;

      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
      });
    }
  })

  it('should throw an error if "lastName" arg is not a string', () => {
    const cases = [{}, []];

    for(let test of cases) {
      const emp = new Employee({ firstName: 'Art', lastName: test, department: 'IT' });;

      emp.validate(err => {
        expect(err.errors.lastName).to.exist;
      });
    }
  })

  it('should throw an error if "department" arg is not a string', () => {
    const cases = [{}, []];

    for(let test of cases) {
      const emp = new Employee({ firstName: 'Art', lastName: 'Pok', department: test });

      emp.validate(err => {
        expect(err.errors.department).to. exist;
      });
    }
  })

  it('should throw an error if "salary" arg is not a number', () => {
    const cases = ['Lorem', 'L012', 'abc', '3000$'];

    for(let test of cases) {
      const emp = new Employee({ firstName: 'Art', lastName: 'Pok', department: 'IT', salary: test });

      emp.validate(err => {
        expect(err.errors.salary).to. exist;
      });
    }
  })


  it('should br correct', () => {
    const cases = [
      {
        firstName: 'Art',
        lastName: 'Pok',
        department: 'It',
        salary: 2000,
      },
      {
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'Marketing',
        salary: 3000,
      },
    ]

    for(let test of cases) {
      const emp = new Employee(test);

      emp.validate(err => {
        expect(err).to.not.exist;
      });
    }
  })
});