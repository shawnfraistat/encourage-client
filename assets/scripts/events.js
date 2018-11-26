// events.js

/* This document is organized into the following sections:

(1) ADVICE Events
(2) ENCOURAGE BUTTON Events
(3) SIGN IN/OUT/UP Events
(4) USER View Events */

const api = require('./api.js')
const getFormFields = require('../../lib/get-form-fields.js')
const store = require('./store.js')
const ui = require('./ui.js')

/////////////////////
//                 //
//  ADVICE Events  //
//                 //
/////////////////////

const addHandlerToLikeButton = () => {
  $('#upvote-button').on('click', onLikeButtonClick)
}

const onAdviceSubmission = event => {
  event.preventDefault()
  const data = {
    advice: {
      approved: false,
      content: '',
      user_id: store.user.id,
      tags: '',
      upvotes: 0
    }
  }
  data.advice.content = $('#submission-text').val()
  const checkBoxArray = $('.encourage-form-check-input')
  for (let i = 0; i < checkBoxArray.length; i++) {
    if (checkBoxArray[i].checked) {
      data.advice.tags += checkBoxArray[i].getAttribute('value') + ' '
    }
  }
  if (data.advice.content === '') {
    ui.submitContentFailure('contentError')
  } else if (data.advice.tags === '') {
    ui.submitContentFailure('noTags')
  } else {
    api.submitAdviceToAPI(data)
      .then(ui.handleAdviceSubmissionSuccess)
      .catch(ui.handleAdviceSubmissionFailure)
  }
}

const onLikeButtonClick = event => {
  event.preventDefault()
  api.addUpvote(store.advice)
    .then(ui.updateUpvoteDisplay)
    .then($('#upvote-button').off('click', onLikeButtonClick))
    .catch(console.log)
}

///////////////////////////////
//                           //
//  ENCOURAGE BUTTON Events  //
//                           //
///////////////////////////////

const onFirstEncourageClick = event => {
  event.preventDefault()
  $('#logInModal').modal('show')
}

const onLoggedInEncourageClick = event => {
  event.preventDefault()
  api.getAdviceFromAPI()
    .then(ui.displayAdvice)
    .then(addHandlerToLikeButton)
    .catch(console.log)
}

const switchEncourageButtonToAdvice = () => {
  $('#encourage-button').off('click', onFirstEncourageClick)
  $('#encourage-button').on('click', onLoggedInEncourageClick)
}

const switchEncourageButtonToLogIn = () => {
  $('#encourage-button').off('click', onLoggedInEncourageClick)
  $('#encourage-button').on('click', onFirstEncourageClick)
}

/////////////////////////////
//                         //
//  SIGN IN/OUT/UP Events  //
//                         //
/////////////////////////////

// onSignIn() is called when the player submits the sign-in form;
// it collects the info from logInModal and passes it to the API
const onSignIn = event => {
  event.preventDefault()
  const target = $('#sign-in')[0]
  const data = getFormFields(target)
  api.signIn(data)
    .then(storeSignInInfo)
    .then(switchEncourageButtonToAdvice)
    .then(ui.handleSignInSuccess)
    .catch(ui.handleSignInFailure)
}

// onSignOut() is called when the player clicks the sign-out nav item
const onSignOut = event => {
  event.preventDefault()
  api.signOut()
    .then(switchEncourageButtonToLogIn)
    .then(ui.handleSignOutSuccess)
    .catch(ui.handleSignOutFailure)
}

// onSignUp() is called when the player submits the sign-up form;
//  it collects the info from logInModal and passes it to the API
const onSignUp = event => {
  event.preventDefault()
  const target = $('#sign-up')[0]
  const data = getFormFields(target)
  data.credentials.tags = ''
  const checkBoxArray = $('.form-check-input')
  for (let i = 0; i < checkBoxArray.length; i++) {
    if (checkBoxArray[i].checked) {
      data.credentials.tags += checkBoxArray[i].getAttribute('value') + ' '
    }
  }
  if (data.credentials.password === data.credentials.password_confirmation) {
    storeSignUpInfo(data)
    api.signUp(data)
      .then(ui.handleSignUpSuccess)
      .catch(ui.handleSignUpFailure)
  } else {
    ui.handleSignUpMismatchingPasswords()
  }
}

// onSignUpContinue() is called when the player tries to dismiss the sign-up
// view on the logInModal--it tries to automatically log a newly signed-up player in
const onSignUpContinue = data => {
  const newCredentials = {
    credentials: {
      email: store.user.email,
      password: store.user.password
    }
  }
  api.signIn(newCredentials)
    .then(storeSignInInfo)
    .then(switchEncourageButtonToAdvice)
    .then(ui.handleSignInAfterSignUpSuccess)
    .catch(ui.handleSignInAfterSignUpFailure)
}

// onSwitchToSignIn() switches the logInModal to the sign in view; it happens if
// the player clicks that option in the logInModal
const onSwitchToSignIn = event => {
  event.preventDefault()
  ui.switchToSignIn()
}

// onSwitchToSignUp() switches the logInModal to the sign up view; it happens if
// the player clicks that option in the logInModal
const onSwitchToSignUp = event => {
  event.preventDefault()
  ui.switchToSignUp()
}

// storeSignInInfo() creates a local version in store.js of the sign-in info it receives from the API
const storeSignInInfo = data => {
  store.user.id = data.user.id
  store.user.email = data.user.email
  store.user.token = data.user.token
  return data
}

// storeSignUpInfo() creates a local version in store.js of the sign-up info it receives from the API
const storeSignUpInfo = data => {
  store.user.email = data.credentials.email
  store.user.password = data.credentials.password
  return data
}

////////////////////////
//                    //
//  USER View Events  //
//                    //
////////////////////////

const addDeleteHandlers = () => {
  $('.delete-advice').on('click', onDeleteAdvice)
}

// onChangePassword() fires when the player clicks submit on the change password submit button in the USER view
const onChangePasswordSubmit = event => {
  event.preventDefault()
  const target = $('#change-password')[0]
  const data = getFormFields(target)
  if (data.passwords.new === data.passwords.confirm_new) {
    api.changePassword(data)
      .done(ui.handleChangePasswordSuccess(data.passwords.new))
      .fail(ui.handleChangePasswordFailure)
  } else {
    ui.handleChangePasswordMismatchingPasswords()
  }
}

const onShowUserView = () => {
  api.getUserAdvicesFromAPI()
    .then(ui.showUserView)
    .then(addDeleteHandlers)
    .catch(console.log)
}

const onDeleteAdvice = event => {
  console.log('inside onDeleteAdvice')
  store.idToDelete = event.currentTarget.id
  $('#deleteConfirmModal').modal('show')
  event.preventDefault()
}

const onDeleteConfirm = event => {
  event.preventDefault()
  api.deleteAdviceFromAPI(store.idToDelete)
    .then(api.getUserAdvicesFromAPI)
    .then(ui.refreshUserView)
    .catch(console.log)
}

module.exports = {
  // ADVICE Events
  onAdviceSubmission,
  // ENCOURAGE BUTTON Events
  onFirstEncourageClick,
  onLoggedInEncourageClick,
  // SIGN IN/OUT/UP Events
  onSignIn,
  onSignOut,
  onSignUp,
  onSignUpContinue,
  onSwitchToSignIn,
  onSwitchToSignUp,
  // USER View Events
  onChangePasswordSubmit,
  onDeleteConfirm,
  onShowUserView
}
