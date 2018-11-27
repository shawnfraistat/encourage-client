// events.js

/* This document is organized into the following sections:

(1) ADMIN Events
(2) ADVICE Events
(3) ENCOURAGE BUTTON Events
(4) SIGN IN/OUT/UP Events
(5) USER View Events */

const api = require('./api.js')
const getFormFields = require('../../lib/get-form-fields.js')
const store = require('./store.js')
const ui = require('./ui.js')

////////////////////
//                //
//  ADMIN Events  //
//                //
////////////////////

const onAdminApproveAdvice = event => {
  event.preventDefault()
  store.idToDelete = event.currentTarget.id
  $('#adminApproveConfirmModal').modal('show')
}

const onAdminApproveConfirm = event => {
  event.preventDefault()
  api.approveAdviceOnAPI(store.idToDelete)
    .then(api.getAllAdvicesFromAPI)
    .then(ui.refreshAdminView)
    .then(addAdminHandlers)
    .catch(console.log)
}

const onAdminDeleteAdvice = event => {
  event.preventDefault()
  store.idToDelete = event.currentTarget.id
  $('#adminDeleteConfirmModal').modal('show')
}

const onAdminDeleteConfirm = event => {
  event.preventDefault()
  console.log('Inside onAdminDeleteConfirm')
  api.deleteAdviceFromAPI(store.idToDelete)
    .then(api.getAllAdvicesFromAPI)
    .then(ui.refreshAdminView)
    .then(addAdminHandlers)
    .catch(console.log)
}

const onShowAdminView = () => {
  api.getAllAdvicesFromAPI()
    .then(ui.showAdminView)
    .then(addAdminHandlers)
    .catch(console.log)
}

const addAdminHandlers = () => {
  $('.delete-advice').on('click', onAdminDeleteAdvice)
  $('.approve-advice').on('click', onAdminApproveAdvice)
}

/////////////////////
//                 //
//  ADVICE Events  //
//                 //
/////////////////////

const addHandlerToLikeButton = hasBeenLiked => {
  hasBeenLiked ? $('#upvote-button').on('click', onLikeButtonUnclick) : $('#upvote-button').on('click', onLikeButtonClick)
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
    .then(ui.incrementUpvoteDisplay)
    .then($('#upvote-button').off('click', onLikeButtonClick))
    .then($('#upvote-button').on('click', onLikeButtonUnclick))
    .catch(console.log)
}

const onLikeButtonUnclick = event => {
  event.preventDefault()
  api.deleteUpvote(store.advice)
    .then(ui.decrementUpvoteDisplay)
    .then($('#upvote-button').off('click', onLikeButtonUnclick))
    .then($('#upvote-button').on('click', onLikeButtonClick))
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
  data.credentials.admin = false
  const checkBoxArray = $('.sign-up-check')
  for (let i = 0; i < checkBoxArray.length; i++) {
    if (checkBoxArray[i].checked) {
      data.credentials.tags += checkBoxArray[i].getAttribute('value') + ' '
    }
  }
  if (data.credentials.tags.trim() === '') {
    ui.handleSignUpNoTags()
  } else if (data.credentials.password !== data.credentials.password_confirmation) {
    ui.handleSignUpMismatchingPasswords()
  } else {
    storeSignUpInfo(data)
    api.signUp(data)
      .then(ui.handleSignUpSuccess)
      .catch(ui.handleSignUpFailure)
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
  store.user.admin = data.user.admin
  console.log('data is', data)
  console.log('store.user.admin is', store.user.admin)
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

const onDeleteAdvice = event => {
  store.idToDelete = event.currentTarget.id
  $('#deleteConfirmModal').modal('show')
  event.preventDefault()
}

const onDeleteConfirm = event => {
  event.preventDefault()
  api.deleteAdviceFromAPI(store.idToDelete)
    .then(api.getUserAdvicesFromAPI)
    .then(ui.refreshUserView)
    .then(addDeleteHandlers)
    .catch(console.log)
}

const onShowUserView = () => {
  api.getUserAdvicesFromAPI()
    .then(ui.showUserView)
    .then(addDeleteHandlers)
    .catch(console.log)
}

const onUserChooseTagsSubmit = () => {
  let tags = ''
  const checkBoxArray = $('.choose-tags-check')
  for (let i = 0; i < checkBoxArray.length; i++) {
    if (checkBoxArray[i].checked) {
      tags += checkBoxArray[i].getAttribute('value') + ' '
    }
  }
  if (tags.trim() === '') {
    ui.handleUpdateTagsNoTags()
  } else {
    const data = { tags: tags }
    api.updateUserTags(data)
      .then(ui.handleUpdateTagsSuccess)
      .catch(ui.handleUpdateTagsFailure)
  }
}

module.exports = {
  // ADMIN events
  onAdminDeleteConfirm,
  onAdminApproveConfirm,
  onShowAdminView,
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
  onShowUserView,
  onUserChooseTagsSubmit
}
