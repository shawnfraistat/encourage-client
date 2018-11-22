// ui.js

/* This document is organized into the following sections:

(1) FORM rest

(8) USER API Interactions */

const store = require('./store.js')

////////////////////
//                //
//  FORM  reset   //
//                //
////////////////////

// clearForms() clears form content in the sign-in/up and change password forms,
// so the form inputs are blank if the user reopens the model
const clearForms = () => {
  document.getElementById('sign-up').reset()
  $('.sign-up-message').html('<h5 class="sign-up-message"></h5>')
  document.getElementById('sign-in').reset()
  $('.sign-in-message').html('<h5 class="sign-in-message"></h5>')
  document.getElementById('change-password').reset()
  $('.change-password-message').text('')
  $('#user-name').text('')
}

////////////////////////////////////
//                                //
//  SIGN-IN/UP view UI functions  //
//                                //
////////////////////////////////////

// handleSignInSuccess() transforms the logInModal to display a confirmation that the user signed in successfully
const handleSignInSuccess = event => {
  $('#logInModalHeader').addClass('collapse')
  $('.sign-in-message').html(`<h4 class="sign-in-message">Signed in as <scan class="blue">${store.user.email}</scan></h4>`)
  // $('#log-in-nav-button').toggleClass('collapse')
  $('#sign-out-nav-button').addClass('collapse')
  $('#user-profile-nav-button').addClass('collapse')
  $('#sign-in').addClass('collapse')
  $('#sign-in-cancel').addClass('collapse')
  $('#sign-in-submit').addClass('collapse')
  $('#sign-in-continue').removeClass('collapse')
}

// handleSignInFailure() displays an error message if a sign-in attempt fails
const handleSignInFailure = event => {
  $('.sign-in-message').html('<h5 class="sign-in-message red">Sign in failed</h5>')
}

// handleSignInAfterSignUpFailure() displays an error if the program fails when it
// tries to automatically sign a user in after a successful sign up
const handleSignInAfterSignUpFailure = event => {
  $('.sign-in-message').html('<h5 class="sign-up-message red">Sign in after sign up failed</h5>')
}

// handleSignInAfterSignUpSuccess() hides the logInModal if the program is able
// to sign the user in automatically following a successful sign up
const handleSignInAfterSignUpSuccess = event => {
  $('#logInModal').modal('hide')
}

// handleSignOutSuccess() clears local data in store.js and resets the view if
// the user successfully signs out
const handleSignOutSuccess = () => {
  $('#signOutModal').modal('hide')
  store.user = {}
  $('#log-in-nav-button').toggleClass('collapse')
  $('#sign-out-nav-button').toggleClass('collapse')
  $('#user-profile-nav-button').toggleClass('collapse')
}

// handleSignOutFailure() displays an error if a sign-out attempt fails
const handleSignOutFailure = event => {
  $('.sign-out-message').html('<p class="red">Failed to sign out</p>')
  console.log(event)
}

// handleSignUpSuccess() transforms the logInModal after the user successfully
// signs up to display a confirmation and get ready for automatic sign-in
const handleSignUpSuccess = event => {
  $('.sign-up-message').html(`<h4 class="sign-up-message">New account created. Logged in as <scan class="blue">${store.user.email}</scan>.</h4>`)
  $('#logInModalHeader').addClass('collapse')
  $('#sign-out-nav-button').toggleClass('collapse')
  $('#user-profile-nav-button').toggleClass('collapse')
  $('#sign-up').addClass('collapse')
  $('#sign-up-cancel').addClass('collapse')
  $('#sign-up-submit').addClass('collapse')
  $('#sign-up-continue').removeClass('collapse')
}

// handleSignUpFailure() displays an error if a sign-up attempt fails
const handleSignUpFailure = event => {
  $('.sign-up-message').html('<h5 class="sign-up-message red">Sign up failed</h5>')
  console.log('Invalid sign up event', event)
}

// handleSignUpMismatchingPasswords() displays an error if, when the user tries
// to sign up, the password and password_confirmation fields don't match
const handleSignUpMismatchingPasswords = event => {
  $('.sign-up-message').html('<h5 class="sign-up-message red">Passwords do not match</h5>')
  console.log('Invalid sign up event', event)
}

// resetLogInModal() sets the sign-in/up modal back to its defaults
const resetLogInModal = () => {
  $('#logInModalHeader').removeClass('collapse')
  $('.sign-in-message').text('')
  $('.sign-up-message').text('')
  $('#sign-in-cancel').removeClass('collapse')
  $('#sign-in-submit').removeClass('collapse')
  $('#sign-in-continue').addClass('collapse')
  switchToSignIn()
}

// switchToSignIn() transforms the logInModal so that the user can sign in
const switchToSignIn = function () {
  clearForms()
  $('#sign-up').addClass('collapse')
  $('.sign-up-footer-buttons').addClass('collapse')
  $('#sign-in').removeClass('collapse')
  $('.sign-in-footer-buttons').removeClass('collapse')
  $('#logInModalTitle').text('Sign In')
}

// switchToSignUp() transforms the logInModal so that the user can sign up
const switchToSignUp = function () {
  clearForms()
  $('#sign-in').addClass('collapse')
  $('.sign-in-footer-buttons').addClass('collapse')
  $('#sign-up').removeClass('collapse')
  $('.sign-up-footer-buttons').removeClass('collapse')
  $('#logInModalTitle').text('Sign Up')
}

module.exports = {
  // FORM reset
  clearForms,
  // SIGN-IN/UP view UI functions
  handleSignInSuccess,
  handleSignInFailure,
  handleSignInAfterSignUpFailure,
  handleSignInAfterSignUpSuccess,
  handleSignUpSuccess,
  handleSignUpFailure,
  handleSignUpMismatchingPasswords,
  handleSignOutSuccess,
  handleSignOutFailure,
  resetLogInModal,
  switchToSignIn,
  switchToSignUp
  // USER view UI functions
  // handleChangePasswordFailure,
  // handleChangePasswordMismatchingPasswords,
  // handleChangePasswordSuccess,
  // showUserView,
  // updateHeader
}
