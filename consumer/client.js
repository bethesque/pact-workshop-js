const moment = require('moment')
const request = require('superagent')
const API_HOST = process.env.API_HOST || 'http://localhost'
const API_PORT = process.env.API_PORT || 9123
const API_ENDPOINT = `${API_HOST}:${API_PORT}`

// Fetch provider data
const fetchProviderData = (customerId) => {
  return request
    .get(`${API_ENDPOINT}/customer/${customerId}`)
    .then((res) => {
      if (res.body.dateJoined.match(/\d{4}-\d{2}-\d{2}/)) {
        return {
          fullName: `${res.body.firstName} ${res.body.lastName}`,
          joined: moment(res.body.dateJoined, 'YYYY-MM-DD').fromNow()
        }
      } else {
        throw new Error('Invalid date format in response')
      }
    })
}

module.exports = {
  fetchProviderData
}
