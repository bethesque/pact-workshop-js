const chai = require('chai')
const path = require('path')
const chaiAsPromised = require('chai-as-promised')
const pact = require('pact')
const moment = require('moment')
const expect = chai.expect
const API_PORT = process.env.API_PORT || 9123
const {
  fetchProviderData
} = require('../client')
chai.use(chaiAsPromised)

// Configure and import consumer API
// Note that we update the API endpoint to point at the Mock Service
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN'

const provider = pact({
  consumer: 'Our Little Consumer',
  provider: 'Our Provider',
  port: API_PORT,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: LOG_LEVEL,
  spec: 2
})
const date = moment().subtract(1, 'day')
const customerId = 1

// Alias flexible matchers for simplicity
const { somethingLike: like, term } = pact.Matchers

describe('Pact with Our Provider', () => {
  describe('when a customer with ID 1 exists', () => {
    describe('when a request for a customer is made', () => {
      before(() => {
        return provider.setup()
          .then(() => {
            provider.addInteraction({
              uponReceiving: 'a request for a customer with ID 1',
              withRequest: {
                method: 'GET',
                path: '/customer/1'
              },
              willRespondWith: {
                status: 200,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                },
                body: {
                  firstName: 'Mary',
                  lastName: 'Jones',
                  dateJoined: term({generate: date, matcher: '\\d{4}-\\d{2}-\\d{2}'})
                }
              }
            })
          })
      })

      it('can process the JSON payload from the provider', () => {
        const response = fetchProviderData(customerId)

        return expect(response).to.eventually.have.property('fullName', 'Mary Jones')
      })

      it('should validate the interactions and create a contract', () => {
        return provider.verify()
      })
    })

    // Write pact files to file
    after(() => {
      return provider.finalize()
    })
  })
})
