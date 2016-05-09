/* eslint-env mocha */
'use strict'

const assert = require('assert')
const Faker = require('Faker')

const app = require('../../../src/app')
var mongo = require('mocha-mongo')(app.get('mongodb'))

var ready = mongo.ready()

describe('meeting service', () => {
  var testMeeting = {
    _id: Faker.Helpers.randomNumber(500).toString(),
    participants: ['p1', 'p2', 'p3'],
    startTime: Faker.Date.recent(),
    active: false
  }

  console.log('test meeting:', testMeeting)

  it('registered the meeting service', () => {
    assert.ok(app.service('meetings'))
  })

  var clean = mongo.cleanCollections(['meetings'])

  it('creates a new meeting', clean(function (db, done) {
    app.service('meetings')
       .create(testMeeting, {})
       .then((meeting) => {
         assert(meeting._id === testMeeting._id)
         done()
       }).catch((err) => {
         done(err)
       })
  }))

  it('encrypted the new meeting', ready(function (db, done) {
    db.collection('meetings').find(
      {
        '_id': testMeeting._id
      },
      function (error, cursor) {
        if (error) {
          done(error)
        }
        cursor.toArray(function (err, documents) {
          if (err) {
            done(err)
          }
          var dbMeeting = documents[0]
          assert(dbMeeting.participants !== testMeeting.participants)
          done()
        })
      })
  }))
})