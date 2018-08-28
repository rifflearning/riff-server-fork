'use strict'

const computeTurnHook = require('./compute-turn-hook')
const activateMeetingHook = require('./activate-meeting-hook')
const deactivateMeetingHook = require('./deactivate-meeting-hook')
const participantsEventHook = require('./participants-event-hook')
const removeParticipantsHook = require('./remove-participants-hook')
const addParticipantHook = require('./add-participant-hook')
const extractUnstructuredQueryHook = require('./extract_unstructured_query-hook')
const applyUnstructuredQueryHook = require('./apply_unstructured_query-hook')
const auth = require('@feathersjs/authentication')

function addStartTime (hook) {
  hook.data.start_time = new Date()         // eslint-disable-line camelcase
  return hook
}

function updateTime (hook) {
  hook.data.lastUpdated = new Date()
  return hook
}

exports.before = {
  all: [ auth.hooks.authenticate('jwt') ],
  create: [ addStartTime, activateMeetingHook ],
  find: [ extractUnstructuredQueryHook ],
  update: [ updateTime ],
  patch: [ updateTime,
           activateMeetingHook,
           removeParticipantsHook,
           addParticipantHook,
           deactivateMeetingHook],
  get: []
}

exports.after = {
  create: [ computeTurnHook, participantsEventHook ],
  update: [ computeTurnHook ],
  patch: [ computeTurnHook, participantsEventHook ],
  all: [],
  find: [ applyUnstructuredQueryHook ]
}
