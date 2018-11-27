// ui.js

/* This document is organized into the following sections:

(1) ADVICE UI Functions
(2) FORM Reset
(3) SIGN-IN/UP View UI functions
(4) USER API Interactions */

const store = require('./store.js')

// sentiment analysis courtesy of https://github.com/thisandagain/sentiment
const Sentiment = require('sentiment')

////////////////////////////
//                        //
//  ADVICE UI Functions   //
//                        //
////////////////////////////

const displayAdvice = data => {
  console.log(data)
  console.log(data.advice.content)
  console.log(data.advice.likes)
  store.advice = data.advice
  let imageURL = ''
  if (data.advice.likes.every(like => like.user_id !== store.user.id)) {
    imageURL = 'assets/images/thumbs-up3.png'
  } else {
    imageURL = 'assets/images/thumbs-up-active.png'
  }
  $('#advice-display').html(`
    <div class="master-container">
      <img src="assets/images/speech-bubble.png" alt="speech bubble" style="width:100%;">
      <div class="centered">
        <blockquote class="blockquote mb-0">
          <p>${data.advice.content}</p>
          <div class="blockquote-footer text-right mr-2">${data.advice.first_name} ${data.advice.last_name}</div>
        </blockquote>
        <hr />
        <div class="upvote-div text-right">
          <button class="btn upvote-button" type="submit" id="upvote-button">
            <img class="like-image" style="width: 22px;" src=${imageURL} alt="click here to like">
          </button>
          <span class="upvote-count">${data.advice.likes.length}</span></div>
      </div>
    </div>
    `)
  sentimentAnalysis(data.advice.content)
  if (data.advice.likes.every(like => like.user_id !== store.user.id)) {
    return false
  } else {
    return true
  }
}

const sentimentAnalysis = string => {
  const sentiment = new Sentiment()
  const result = (sentiment.analyze(string)).comparative
  console.log(result)
  if (result >= 1 && result <= 5) {
    $('body').attr('style', 'background-color: #66fff2;')
  } else if (result >= 0.75 && result < 1) {
    $('body').attr('style', 'background-color: #75f0e5;')
  } else if (result >= 0.5 && result < 0.75) {
    $('body').attr('style', 'background-color: #79ece2;')
  } else if (result >= 0.25 && result < 0.5) {
    $('body').attr('style', 'background-color: #7de8df;')
  } else if (result >= 0 && result < 0.25) {
    $('body').attr('style', 'background-color: #8fd8d2;')
  } else if (result >= -0.25 && result < 0) {
    $('body').attr('style', 'background-color: #2e847d;')
  } else if (result >= -0.5 && result < -0.25) {
    $('body').attr('style', 'background-color: #215e59')
  } else if (result >= -0.75 && result < -0.5) {
    $('body').attr('style', 'background-color: #1b4b47;')
  } else if (result >= -1 && result < -0.75) {
    $('body').attr('style', 'background-color: #143936;')
  } else if (result >= -5 && result < -1) {
    $('body').attr('style', 'background-color: #0d2624;')
  }
}

const decrementUpvoteDisplay = data => {
  console.log(data)
  $('.upvote-count').text(data.advice.likes.length)
  $('.like-image').attr('src', 'assets/images/thumbs-up3.png')
}

const handleAdviceSubmissionFailure = () => {
  $('.submit-advice-message').html(`<h5 class="submit-advice-message failure">Encouragement submission failed</h5>`)
}

const handleAdviceSubmissionSuccess = () => {
  $('.submit-advice-message').html(`<h5 class="submit-advice-message success">Encouragement submitted!</h5>`)
}

const incrementUpvoteDisplay = data => {
  $('.upvote-count').text(data.like.advice.likes.length)
  $('.like-image').attr('src', 'assets/images/thumbs-up-active.png')
}

const submitContentFailure = error => {
  if (error === 'contentError') {
    $('.submit-advice-message').html('<h5 class="submit-advice-message failure">Encouragement needs content</h5>')
  } else if (error === 'noTags') {
    $('.submit-advice-message').html('<h5 class="submit-advice-message failure">Need at least one tag</h5>')
  }
}

////////////////////
//                //
//  FORM  Reset   //
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
  $('.submit-advice-message').html('<h5 class="submit-advice-message"></h5>')
  document.getElementById('submit-advice').reset()
  $('.change-password-message').text('')
  $('#user-name').text('')
}

////////////////////////////////////
//                                //
//  SIGN-IN/UP View UI Functions  //
//                                //
////////////////////////////////////

// handleSignInSuccess() transforms the logInModal to display a confirmation that the user signed in successfully
const handleSignInSuccess = event => {
  $('#logInModalHeader').addClass('collapse')
  $('#navbar-content').addClass('collapse')
  $('.sign-in-message').html(`<h4 class="sign-in-message">Signed in as <scan class="success">${store.user.email}</scan></h4>`)
  $('#login-nav-button').addClass('collapse')
  $('#sign-out-nav-button').removeClass('collapse')
  $('#user-profile-nav-button').removeClass('collapse')
  $('#submit-encouragement-nav-button').removeClass('collapse')
  $('#sign-in').addClass('collapse')
  $('#sign-in-cancel').addClass('collapse')
  $('#sign-in-submit').addClass('collapse')
  $('#sign-in-continue').removeClass('collapse')
}

// handleSignInFailure() displays an error message if a sign-in attempt fails
const handleSignInFailure = event => {
  $('.sign-in-message').html('<h5 class="sign-in-message failure">Sign in failed</h5>')
}

// handleSignInAfterSignUpFailure() displays an error if the program fails when it
// tries to automatically sign a user in after a successful sign up
const handleSignInAfterSignUpFailure = event => {
  $('.sign-in-message').html('<h5 class="sign-up-message failure">Sign in after sign up failed</h5>')
}

// handleSignInAfterSignUpSuccess() hides the logInModal if the program is able
// to sign the user in automatically following a successful sign up
const handleSignInAfterSignUpSuccess = event => {
  $('#logInModal').modal('hide')
  $('#navbar-content').addClass('collapse')
  $('#login-nav-button').addClass('collapse')
  $('#sign-out-nav-button').removeClass('collapse')
  $('#user-profile-nav-button').removeClass('collapse')
  $('#submit-encouragement-nav-button').removeClass('collapse')
}

// handleSignOutSuccess() clears local data in store.js and resets the view if
// the user successfully signs out
const handleSignOutSuccess = () => {
  store.user = {}
  $('#signOutModal').modal('hide')
  $('#login-nav-button').removeClass('collapse')
  $('#sign-out-nav-button').addClass('collapse')
  $('#user-profile-nav-button').addClass('collapse')
  $('#submit-encouragement-nav-button').addClass('collapse')
  $('#advice-display').html('')
  $('body').attr('style', 'background-color: #8fd8d2;')
  // $('#navbar-content').removeClass('show')
}

// handleSignOutFailure() displays an error if a sign-out attempt fails
const handleSignOutFailure = event => {
  $('.sign-out-message').html('<p class="failure">Failed to sign out</p>')
  console.log(event)
}

// handleSignUpSuccess() transforms the logInModal after the user successfully
// signs up to display a confirmation and get ready for automatic sign-in
const handleSignUpSuccess = event => {
  $('.sign-up-message').html(`<h4 class="sign-up-message">New account created. Logged in as <scan class="success">${store.user.email}</scan>.</h4>`)
  $('#logInModalHeader').addClass('collapse')
  $('#sign-up').addClass('collapse')
  $('#sign-up-cancel').addClass('collapse')
  $('#sign-up-submit').addClass('collapse')
  $('#sign-up-continue').removeClass('collapse')
}

// handleSignUpFailure() displays an error if a sign-up attempt fails
const handleSignUpFailure = event => {
  $('.sign-up-message').html('<h5 class="sign-up-message failure">Sign up failed</h5>')
  console.log('Invalid sign up event', event)
}

// handleSignUpMismatchingPasswords() displays an error if, when the user tries
// to sign up, the password and password_confirmation fields don't match
const handleSignUpMismatchingPasswords = event => {
  $('.sign-up-message').html('<h5 class="sign-up-message failure">Passwords do not match</h5>')
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

//////////////////////////////
//                          //
//  USER View UI Functions  //
//                          //
//////////////////////////////

// handleChangePasswordFailure() displays an error message if the attempt to
// change a user's password on the API failed
const handleChangePasswordFailure = function () {
  $('.change-password-message').html('<h6 class="change-password-message failure">Invalid password</h6>')
}

// handleChangePasswordMismatchingPasswords() displays an error if the user
// tries to change their password, and the new password and
// new password confirmation fields don't match
const handleChangePasswordMismatchingPasswords = function () {
  $('.change-password-message').html('<h6 class="change-password-message failure">New passwords do not match</h6>')
}

// handleChangePasswordSuccess() displays a message when the user successfully
// changes their password
const handleChangePasswordSuccess = function (newPassword) {
  store.user.password = newPassword
  $('.change-password-message').html('<h6 class="change-password-message success">Password changed</h6>')
}

const refreshUserView = advices => {
  $('#deleteConfirmModal').modal('hide')
  showUserView(advices)
}

const showSettingsDiv = () => {
  $('#settings-div').removeClass('collapse')
  $('#your-submissions-div').addClass('collapse')
  $('#settings-nav-link').addClass('active')
  $('#your-submissions-nav-link').removeClass('active')
}

const showSubmissionsDiv = () => {
  $('#settings-div').addClass('collapse')
  $('#your-submissions-div').removeClass('collapse')
  $('#settings-nav-link').removeClass('active')
  $('#your-submissions-nav-link').addClass('active')
}

const showUserView = advices => {
  console.log('advices is', advices)
  let newHTML = ''
  newHTML += `
  <table class="table text-center table-responsive submission-table">
    <thead class="thead-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Content</th>
        <th scope="col">Tags</th>
        <th scope="col">Upvotes</th>
        <th scope="col">Approved?</th>
        <th scope="col">Delete?</th>
      </tr>
    </thead>
    <tbody`
  let i = 0
  advices.advices.forEach((element) => {
    i++
    newHTML += `
      <tr>
        <th scope="row">${i}</th>
        <td data-content="${element.content}">${element.content.slice(0, 9)}</td>
        <td>${element.tags.split(' ').join(', ').slice(0, -2)}</td>
        <td>${element.likes.length}</td>
        <td>${element.approved}</td>
        <td style="width: 22px;"><img src="assets/images/delete.ico" style="width: 20px;" id="${element.id}" class="delete-advice"></td>
      </tr>
    `
  })
  newHTML += `  </tbody>
  </table>`
  $('.your-submissions-field').html(newHTML)
}

module.exports = {
  // ADVICE UI Functions,
  displayAdvice,
  handleAdviceSubmissionFailure,
  handleAdviceSubmissionSuccess,
  submitContentFailure,
  decrementUpvoteDisplay,
  incrementUpvoteDisplay,
  // FORM Reset
  clearForms,
  // SIGN-IN/UP View UI Functions
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
  switchToSignUp,
  // USER View UI Functions
  handleChangePasswordFailure,
  handleChangePasswordMismatchingPasswords,
  handleChangePasswordSuccess,
  refreshUserView,
  showSettingsDiv,
  showSubmissionsDiv,
  showUserView
}
