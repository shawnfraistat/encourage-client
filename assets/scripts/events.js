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

// addAdminHandlers() enables the buttons in the ADMIN view, connecting them to
// event handlers in this file
const addAdminHandlers = () => {
  $('.delete-advice').on('click', onAdminDeleteAdvice)
  $('.approve-advice').on('click', onAdminApproveAdvice)
  $('.unapprove-advice').on('click', onAdminUnapproveAdvice)
}

// onAdminApproveAdvice() is called when the admin clicks the approve advice
// button in the ADMIN view; it prompts the admin to check whether they really
// want to approve
const onAdminApproveAdvice = event => {
  event.preventDefault()
  store.idToApprove = event.currentTarget.id
  $('#adminApproveConfirmModal').modal('show')
}

// onAdminApproveConfirm() fires when the admin confirms they want to approve
// a given piece of advice; it updates the API and then refreshes the ADMIN view
const onAdminApproveConfirm = event => {
  event.preventDefault()
  api.approveAdviceOnAPI(store.idToApprove)
    .then(api.getAllAdvicesFromAPI)
    .then(ui.refreshAdminView)
    .then(addAdminHandlers)
    .catch(console.log)
}

// onAdminDeleteAdvice() fires when the admin wants to delete a piece of advice;
// it pops a confirmation modal
const onAdminDeleteAdvice = event => {
  event.preventDefault()
  store.idToDelete = event.currentTarget.id
  $('#adminDeleteConfirmModal').modal('show')
}

// onAdminDeleteConfirm() fires when the admin confirms they want to delete a
// piece of advice; it tells the API to delete the advice and then refreshes the
// ADMIN view
const onAdminDeleteConfirm = event => {
  event.preventDefault()
  api.deleteAdviceFromAPI(store.idToDelete)
    .then(api.getAllAdvicesFromAPI)
    .then(ui.refreshAdminView)
    .then(addAdminHandlers)
    .catch(console.log)
}

// onAdminUnapproveAdvice() fires when the admin clicks the "unapprove" advice
// button in the ADMIN view; it prompts the admin to check whether they really
// want to reovke approve
const onAdminUnapproveAdvice = event => {
  event.preventDefault()
  store.idToUnapprove = event.currentTarget.id
  $('#adminUnapproveConfirmModal').modal('show')
}

// onAdminApproveConfirm() fires when the admin confirms they want to unapprove
// a given piece of advice; it updates the API and then refreshes the ADMIN view
const onAdminUnapproveConfirm = event => {
  event.preventDefault()
  api.unapproveAdviceOnAPI(store.idToUnapprove)
    .then(api.getAllAdvicesFromAPI)
    .then(ui.refreshAdminView)
    .then(addAdminHandlers)
    .catch(console.log)
}

// onShowAdminView() fires when the user selects "Admin" from the dropdown nav;
// it gets all the pieces of advice from the API and prepares to display them
const onShowAdminView = () => {
  api.getAllAdvicesFromAPI()
    .then(ui.showAdminView)
    .then(addAdminHandlers)
    .catch(console.log)
}

/////////////////////
//                 //
//  ADVICE Events  //
//                 //
/////////////////////

// refreshAdvice() fires when a given piece of advice is being displayed, and
// it's changed in some way--it's liked or favorited, for instance;
// this refreshes the display
const refreshAdvice = () => {
  if (store.advice !== undefined) {
    api.getSpecificAdviceFromAPI(store.advice.id)
      .then(ui.displayAdvice)
      .then(addHandlersToAdviceButtons)
      .catch(console.log)
  }
}

// addHandlersToAdviceButtons() adds event handlers to the like and favorite
// buttons on pieces of advice; if they've already been liked and/or favorited,
// then the event handlers on the buttons are set to "unlike" and "unfavorite"
const addHandlersToAdviceButtons = displayState => {
  displayState[0] ? $('#upvote-button').on('click', onLikeButtonUnclick) : $('#upvote-button').on('click', onLikeButtonClick)
  displayState[1] ? $('#favorite-button').on('click', onFavoriteButtonUnclick) : $('#favorite-button').on('click', onFavoriteButtonClick)
}

// onAdviceSubmission() is called if the user clicks the submit button on the
// "Submit Encouragement" form; it grabs the submission data, checks to see if
// it's valid, and then passes it on the API
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

// onFavoriteButtonClick() fires when the user clicks the favorite button on a
// piece of advice; it tells the API to create a new favorite object, then
// switches the display so the button visually updates, and then switches the
// event handlers around so that if the user clicks on the button again, it
// removes the favorite
const onFavoriteButtonClick = event => {
  event.preventDefault()
  api.addFavorite(store.advice)
    .then(ui.addFavoriteDisplay)
    .then($('#favorite-button').off('click', onFavoriteButtonClick))
    .then($('#favorite-button').on('click', onFavoriteButtonUnclick))
    .catch(console.log)
}

// onFavoriteButtonUnclick() fires when the user clicks the favorite button on a
// piece of advice that's already been favorited; it tells the API to delete the
// favorite. It switches the display so the button visually updates, and then
// switches the event handlers around so that if the user clicks on the button
// again, it adds a favorite
const onFavoriteButtonUnclick = event => {
  event.preventDefault()
  api.deleteFavorite(store.advice)
    .then(ui.deleteFavoriteDisplay)
    .then($('#favorite-button').off('click', onFavoriteButtonUnclick))
    .then($('#favorite-button').on('click', onFavoriteButtonClick))
    .catch(console.log)
}

// onFavoriteButtonClick() fires when the user clicks the like button on a
// piece of advice; it tells the API to create a new like object, then
// switches the display so the button visually updates, and then switches the
// event handlers around so that if the user clicks on the button again, it
// removes the like
const onLikeButtonClick = event => {
  event.preventDefault()
  api.addUpvote(store.advice)
    .then(ui.addLikeDisplay)
    .then($('#upvote-button').off('click', onLikeButtonClick))
    .then($('#upvote-button').on('click', onLikeButtonUnclick))
    .catch(console.log)
}

// onLikeButtonUnclick() fires when the user clicks the favorite button on a
// piece of advice that's already been liked; it tells the API to delete the
// liked. It switches the display so the button visually updates, and then
// switches the event handlers around so that if the user clicks on the button
// again, it adds a like
const onLikeButtonUnclick = event => {
  event.preventDefault()
  api.deleteUpvote(store.advice)
    .then(ui.deleteLikeDisplay)
    .then($('#upvote-button').off('click', onLikeButtonUnclick))
    .then($('#upvote-button').on('click', onLikeButtonClick))
    .catch(console.log)
}

///////////////////////////////
//                           //
//  ENCOURAGE BUTTON Events  //
//                           //
///////////////////////////////

// onFirstEncourageClick() fires if the user clicks the ENCOURAGE button before
// logging in; it shows the log-in modal
const onFirstEncourageClick = event => {
  event.preventDefault()
  $('#logInModal').modal('show')
}

// onLoggedInEncourageClick() fires if the user clicks the ENCOURAGE button once
// they're logged in; it then gets a random piece of advice from the API and
// displays it
const onLoggedInEncourageClick = event => {
  event.preventDefault()
  api.getAdviceFromAPI()
    .then(ui.displayAdvice)
    .then(addHandlersToAdviceButtons)
    .catch(console.log)
}

// switchEncourageButtonToAdvice() flips around the event handlers once the user
// logs in, so that pressing the ENCOURAGE button now displays a random piece of
// advice
const switchEncourageButtonToAdvice = () => {
  $('#encourage-button').off('click', onFirstEncourageClick)
  $('#encourage-button').on('click', onLoggedInEncourageClick)
}

// switchEncourageButtonToAdvice() flips around the event handlers if the user
// logs out, so that pressing the ENCOURAGE button now displays the log-in modal
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

// addDeleteHandlers() enables the "delete advice" buttons in the USER view
const addDeleteHandlers = () => {
  $('.delete-advice').on('click', onDeleteAdvice)
}

// addFavoriteDeleteHandlers() enables the buttons in the USER view that allow
// users to unfavorite pieces of advice they've favorited
const addFavoriteDeleteHandlers = () => {
  $('.delete-favorite').on('click', onDeleteFavorite)
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

// onDeleteAdvice() fires when the user clicks the "delete advice" button in the
// USER view; it pops a confirmation modal
const onDeleteAdvice = event => {
  store.idToDelete = event.currentTarget.id
  $('#deleteConfirmModal').modal('show')
  event.preventDefault()
}

// onDeleteConfirm() fires when the user clicks the confirmation button on the
// delete advice confirmation modal; it goes ahead and deletes the piece of
// advice from the API and refreshes the view
const onDeleteConfirm = event => {
  event.preventDefault()
  api.deleteAdviceFromAPI(store.idToDelete)
    .then(api.getUserAdvicesFromAPI)
    .then(ui.refreshUserView)
    .then(addDeleteHandlers)
    .catch(console.log)
}

// onDeleteAdvice() fires when the user clicks the "remove favorite" button in the
// USER view; it pops a confirmation modal
const onDeleteFavorite = event => {
  event.preventDefault()
  store.idToDelete = event.currentTarget
  $('#deleteFavoriteConfirmModal').modal('show')
}

// onDeleteConfirm() fires when the user clicks the confirmation button on the
// unfavorite advice confirmation modal; it goes ahead and deletes the favorite
// from the API and refreshes the view
const onDeleteFavoriteConfirm = event => {
  event.preventDefault()
  api.deleteFavorite(store.idToDelete)
    .then(api.getUserFavoritesFromAPI)
    .then(ui.refreshFavoritesUserView)
    .then(addFavoriteDeleteHandlers)
    .catch(console.log)
}

// onShowUseFavoritesrView() fires when the user opens the USER view via the "User
// Settings" nav link; it gets all of the favorited advice associated with the
// current user and gets them ready to display in a table
const onShowUserFavoritesView = () => {
  api.getUserFavoritesFromAPI()
    .then(ui.showFavoritesUserView)
    .then(addFavoriteDeleteHandlers)
    .catch(console.log)
}

// onShowUserView() fires when the user opens the USER view via the "User
// Settings" nav link; it gets all of the advice the current user has authored
// from the API and gets them ready to display in a table
const onShowUserView = () => {
  api.getUserAdvicesFromAPI()
    .then(ui.showUserView)
    .then(addDeleteHandlers)
    .catch(console.log)
}

// onUserChooseTagsSubmit() fires when the user selects new tags in the USER
// view; it updates the API with the current user's tag preferences
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
  // ADMIN Events
  onAdminDeleteConfirm,
  onAdminApproveConfirm,
  onAdminUnapproveConfirm,
  onShowAdminView,
  // ADVICE Events
  onAdviceSubmission,
  refreshAdvice,
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
  onDeleteFavoriteConfirm,
  onShowUserFavoritesView,
  onShowUserView,
  onUserChooseTagsSubmit
}
