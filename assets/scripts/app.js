'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
const events = require('./events.js')
const ui = require('./ui.js')

$(() => {
  $('#change-password-submit').on('click', events.onChangePasswordSubmit)
  $('#encourage-button').on('click', events.onFirstEncourageClick)
  $('#logInModal').on('show.bs.modal', ui.resetLogInModal)
  $('#sign-in-submit').on('click', events.onSignIn)
  $('#sign-out-submit').on('click', events.onSignOut)
  $('#sign-up-submit').on('click', events.onSignUp)
  $('#sign-up-continue').on('click', events.onSignUpContinue)
  $('#submit-advice-submit').on('click', events.onAdviceSubmission)
  $('.switch-to-sign-in').on('click', events.onSwitchToSignIn)
  $('.switch-to-sign-up').on('click', events.onSwitchToSignUp)
  $('#user-view-done').on('click', ui.clearForms)
  $('#userViewModal').on('show.bs.modal', ui.showUserView)
})
