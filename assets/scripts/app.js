'use strict'

/*
TO-DO LIST:

1. Add Favorite Function
2. Add tooltips
3. Adjust sentiment analysis colors?
4. Add Admin View
*/

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
const events = require('./events.js')
const ui = require('./ui.js')

$(() => {
  $('[data-toggle="tooltip"]').tooltip()
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
  $('#userViewModal').on('show.bs.modal', events.onShowUserView)
  $('#delete-item-submit').on('click', events.onDeleteConfirm)
  $('#your-submissions-nav-link').on('click', ui.showSubmissionsDiv)
  $('#settings-nav-link').on('click', ui.showSettingsDiv)
  $('#user-choose-tags-submit').on('click', events.onUserChooseTagsSubmit)
})
