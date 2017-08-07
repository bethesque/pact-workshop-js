const moment = require('moment')
const request = require('superagent')
const API_HOST = process.env.API_HOST || 'http://localhost'
const API_PORT = process.env.API_PORT || 9123
const API_ENDPOINT = `${API_HOST}:${API_PORT}`

// Fetch provider data
const fetchProviderData = () => {
  return request
    .get(`${API_ENDPOINT}/customer/1`)
    .then((res) => {
      return {
        fullName: `${res.body.firstName} ${res.body.surname}`,
        joined: moment(res.body.dateJoined, 'YYYY-MM-DD').fromNow()
      }
    })
}

module.exports = {
  fetchProviderData
}
