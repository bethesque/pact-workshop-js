const moment = require('moment')
const chai = require('chai')
const nock = require('nock')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const API_PORT = process.env.API_PORT || 9123
chai.use(chaiAsPromised)

// Configure and import consumer API
// Note that we update the API endpoint to point at the Mock Service
const API_HOST = `http://localhost:${API_PORT}`

describe('Consumer', () => {
  describe('a request to retrieve a customer', () => {
    const { fetchProviderData } = require('../client')

    it('can process the JSON payload from the provider', () => {
      nock(API_HOST)
        .get('/customer/1')
        .reply(200, {
          firstName: 'Mary',
          surname: 'Jones',
          dateJoined: moment().subtract(1, 'day')
        })

      const response = fetchProviderData()

      return expect(response).to.eventually.have.property('fullName', 'Mary Jones')
    })
  })
})
