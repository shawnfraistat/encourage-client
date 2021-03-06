// ui.js

/* This document is organized into the following sections:

(1) ADMIN UI functions
(2) ADVICE UI Functions
(3) FORM Functions
(4) SIGN-IN/UP View UI functions
(5) USER View UI Functions */

const store = require('./store.js')

// sentiment analysis courtesy of https://github.com/thisandagain/sentiment
const Sentiment = require('sentiment')

///////////////////////////
//                       //
//  ADMIN UI Functions   //
//                       //
///////////////////////////

// showApprovedDiv() fires in the ADMIN view when the user switches to the
// "approved advice" tab; it displays a div loaded with all the approved advice
const showApprovedDiv = () => {
  $('#approved-submissions-div').removeClass('collapse')
  $('#unapproved-submissions-div').addClass('collapse')
  $('#approved-submissions-nav-link').addClass('active')
  $('#unapproved-submissions-nav-link').removeClass('active')
}

// showApprovedDiv() fires in the ADMIN view when the user switches to the
// "unapproved advice" tab; it displays a div loaded with unapproved advice
const showUnapprovedDiv = () => {
  $('#approved-submissions-div').addClass('collapse')
  $('#unapproved-submissions-div').removeClass('collapse')
  $('#approved-submissions-nav-link').removeClass('active')
  $('#unapproved-submissions-nav-link').addClass('active')
}

// refreshAdminView() fires when advice is approved, unapproved, or deleted;
// it refreshes the display to reflect the changes
const refreshAdminView = advices => {
  $('#adminApproveConfirmModal').modal('hide')
  $('#adminDeleteConfirmModal').modal('hide')
  $('#adminUnapproveConfirmModal').modal('hide')
  showAdminView(advices)
}

// showAdminView() fires when the user clicks the ADMIN nav link; it loads up
// two divs with lists of approved and unapproved advice, displayed in tables
const showAdminView = advices => {
  const unapprovedAdvices = advices.advices.filter(advice => advice.approved !== 'true')
  const approvedAdvices = advices.advices.filter(advice => advice.approved === 'true')
  let unapprovedHTML = ''
  unapprovedHTML += `
  <table class="table text-center table-responsive submission-table">
    <thead class="thead-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Content</th>
        <th scope="col">Tags</th>
        <th scope="col">Upvotes</th>
        <th scope="col">Approve?</th>
        <th scope="col">Delete?</th>
      </tr>
    </thead>
    <tbody`
  let i = 0
  unapprovedAdvices.forEach((element) => {
    i++
    unapprovedHTML += `
      <tr>
        <th scope="row">${i}</th>
        <td style="text-align: left;">${element.content}</td>
        <td>${element.tags.split(' ').join(', ').slice(0, -2)}</td>
        <td>${element.likes.length}</td>
        <td style="width: 22px;"><img src="public/images/approval.png" style="width: 25px;" id="${element.id}" class="approve-advice"></td>
        <td style="width: 22px;"><img src="public/images/delete.ico" style="width: 20px;" id="${element.id}" class="delete-advice"></td>
      </tr>
    `
  })
  unapprovedHTML += `  </tbody>
  </table>`
  let approvedHTML = ''
  approvedHTML += `
  <table class="table text-center table-responsive submission-table">
    <thead class="thead-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Content</th>
        <th scope="col">Tags</th>
        <th scope="col">Upvotes</th>
        <th scope="col">Unapprove?</th>
        <th scope="col">Delete?</th>
      </tr>
    </thead>
    <tbody`
  i = 0
  approvedAdvices.forEach((element) => {
    i++
    approvedHTML += `
      <tr>
        <th scope="row">${i}</th>
        <td style="text-align: left;">${element.content}</td>
        <td>${element.tags.split(' ').join(', ').slice(0, -2)}</td>
        <td>${element.likes.length}</td>
        <td style="width: 22px;"><img src="public/images/unapprove.png" style="width: 20px;" id="${element.id}" class="unapprove-advice"></td>
        <td style="width: 22px;"><img src="public/images/delete.ico" style="width: 20px;" id="${element.id}" class="delete-advice"></td>
      </tr>
    `
  })
  approvedHTML += `  </tbody>
  </table>`
  if (approvedAdvices.length === 0) {
    approvedHTML = '<h6>No approved submissions</h6>'
  }
  if (unapprovedAdvices.length === 0) {
    unapprovedHTML = '<h6>No unapproved submissions pending</h6>'
  }
  $('.approved-submissions-field').html(approvedHTML)
  $('.unapproved-submissions-field').html(unapprovedHTML)
}

const showAdminViewFail = () => {
  $('.approved-submissions-field').html('<h6 class="failure">Error: could not reach server</h6>')
  $('.unapproved-submissions-field').html('<h6 class="failure">Error: could not reach server</h6>')
}

////////////////////////////
//                        //
//  ADVICE UI Functions   //
//                        //
////////////////////////////

// displayAdvice() is used to display a random piece of advice in a speech
// bubble popping out of the ENCOURAGE button
const displayAdvice = data => {
  if (data !== undefined) {
    store.advice = data.advice
    let likeImageURL = ''
    let likeTitle = ''
    let favoriteImageURL = ''
    let favoriteTitle = ''
    const displayState = []
    if (data.advice.likes !== undefined) {
      if (data.advice.likes.every(like => like.user_id !== store.user.id)) {
        likeImageURL = 'public/images/thumbs-up3.png'
        likeTitle = 'Click here to like'
        displayState.push(false)
      } else {
        likeImageURL = 'public/images/thumbs-up-active.png'
        likeTitle = 'Click here to unlike'
        displayState.push(true)
      }
    } else {
      likeImageURL = 'public/images/thumbs-up3.png'
      likeTitle = 'Click here to like'
      displayState.push(false)
    }
    if (data.advice.favorites !== undefined) {
      if (data.advice.favorites.every(favorite => favorite.user_id !== store.user.id)) {
        favoriteImageURL = 'public/images/favorite.png'
        favoriteTitle = 'Click here to favorite'
        displayState.push(false)
      } else {
        favoriteImageURL = 'public/images/favorited.png'
        favoriteTitle = 'Click here to unfavorite'
        displayState.push(true)
      }
    } else {
      favoriteImageURL = 'public/images/favorite.png'
      favoriteTitle = 'Click here to favorite'
      displayState.push(false)
    }
    const sentimentValue = sentimentAnalysis(data.advice.content)
    $('#advice-display').html(`
      <div class="master-container">
        <img src="public/images/speech-bubble.png" alt="speech bubble" style="width:100%;">
        <div class="centered">
          <blockquote class="blockquote mb-0">
            <p>${data.advice.content}</p>
            <div class="blockquote-footer text-right mr-2">${data.advice.first_name} ${data.advice.last_name}</div>
          </blockquote>
          <hr class="advice-display-hr"/>
          <div class="advice-footer">
            <div>
              <img class="sentiment-image" src="public/images/face${sentimentValue}.png" data-toggle="tooltip" title="Result of performing sentiment analysis on this piece of encouragement: score is ${sentimentValue}">
            </div>

            <div class="upvote-div">
              <button class="btn favorite-button" type="submit" id="favorite-button">
                <img class="favorite-image" src=${favoriteImageURL} data-toggle="tooltip" title="${favoriteTitle}">
              </button>
              <button class="btn upvote-button" type="submit" id="upvote-button">
                <img class="like-image" src=${likeImageURL} data-toggle="tooltip" title="${likeTitle}" alt="${likeTitle}">
              </button>
              <span class="upvote-count" data-toggle="tooltip" title="Total likes">${data.advice.likes.length}</span></div>
          </div>
        </div>
      </div>
      `)
    $('[data-toggle="tooltip"]').tooltip()
    return displayState
  } else {
    $('#advice-display').html(`
      <div class="master-container">
        <img src="public/images/speech-bubble.png" alt="speech bubble" style="width:100%;">
        <div class="centered">
          <blockquote class="blockquote mb-0">
            <p>No pieces of encouragement currently exist for your selected tags; choose additional tags in User Profile and try again</p>
          </blockquote>
        </div>
      </div>
      `)
    return null
  }
}

// addFavoriteDisplay() switches the favorite button image and pop-up text
// around after the button's been clicked
const addFavoriteDisplay = data => {
  $('.favorite-image').attr('src', 'public/images/favorited.png')
  $('.favorite-image').attr('data-original-title', 'Click here to unfavorite')
}

// addLikeDisplay() switches the like button image and pop-up text around after
// the button's been clicked
const addLikeDisplay = data => {
  $('.upvote-count').text(data.like.advice.likes.length)
  $('.like-image').attr('src', 'public/images/thumbs-up-active.png')
  $('.like-image').attr('data-original-title', 'Click here to unlike')
}

// deleteFavoriteDisplay() reverts the favorite button image and pop-up text
// if the favorite button is unclicked
const deleteFavoriteDisplay = data => {
  $('.favorite-image').attr('src', 'public/images/favorite.png')
  $('.favorite-image').attr('data-original-title', 'Click here to favorite')
}

// deleteLikeDisplay() reverts the like button image and pop-up text around after
// the button's been clicked
const deleteLikeDisplay = data => {
  $('.upvote-count').text(data.advice.likes.length)
  $('.like-image').attr('src', 'public/images/thumbs-up3.png')
  $('.like-image').attr('data-original-title', 'Click here to like')
}

// handleAdviceSubmissionFailure() displays an error if the user attempts to
// submit a piece of advice and API returns failure
const handleAdviceSubmissionFailure = () => {
  $('.submit-advice-message').html(`<h5 class="submit-advice-message failure">Encouragement submission failed</h5>`)
}

// handleAdviceSubmissionSuccess() displays a success message if the user
// attempts to submit a piece of advice and the API returns success
const handleAdviceSubmissionSuccess = () => {
  $('.submit-advice-message').html(`<h5 class="submit-advice-message success">Encouragement submitted!</h5>`)
}

// handleLoggedInEncourageClickError() displays a bubble with an error if the
// ENCOURAGE button is clicked and the server is unreachable
const handleLoggedInEncourageClickError = () => {
  $('#advice-display').html(`
    <div class="master-container">
      <img src="public/images/speech-bubble.png" alt="speech bubble" style="width:100%;">
      <div class="centered">
        <blockquote class="blockquote mb-0">
          <p class="text-center">Error: couldn't reach server</p>
        </blockquote>
      </div>
    </div>
    `)
}

// sentimentAnalysis() analyzes the content of the random piece of advice
// returned by the API, assessing the emotional valence of each word and scoring
// the whole string according to how "positive" or "negative" the sentiment is
// that it expresses on scale of -5 to 5; then it changes the background color
// to reflect the mode and returns the  rating
const sentimentAnalysis = string => {
  const sentiment = new Sentiment()
  const result = (sentiment.analyze(string)).comparative
  if (result >= 1 && result <= 5) {
    $('body').attr('style', 'background-color: #66fff2;')
    return 5
  } else if (result >= 0.75 && result < 1) {
    $('body').attr('style', 'background-color: #75f0e5;')
    return 4
  } else if (result >= 0.5 && result < 0.75) {
    $('body').attr('style', 'background-color: #79ece2;')
    return 3
  } else if (result >= 0.25 && result < 0.5) {
    $('body').attr('style', 'background-color: #7de8df;')
    return 2
  } else if (result >= 0 && result < 0.25) {
    $('body').attr('style', 'background-color: #8fd8d2;')
    return 1
  } else if (result >= -0.25 && result < 0) {
    $('body').attr('style', 'background-color: #2e847d;')
    return 0
  } else if (result >= -0.5 && result < -0.25) {
    $('body').attr('style', 'background-color: #215e59')
    return -1
  } else if (result >= -0.75 && result < -0.5) {
    $('body').attr('style', 'background-color: #1b4b47;')
    return -2
  } else if (result >= -1 && result < -0.75) {
    $('body').attr('style', 'background-color: #143936;')
    return -3
  } else if (result >= -5 && result < -1) {
    $('body').attr('style', 'background-color: #0d2624;')
    return -4
  }
}

// submitContentFailure() displays an error if a user attempts to submit advice
// but it's blank or doesn't have any tags selected
const submitContentFailure = error => {
  if (error === 'contentError') {
    $('.submit-advice-message').html('<h5 class="submit-advice-message failure">Encouragement needs content</h5>')
  } else if (error === 'noTags') {
    $('.submit-advice-message').html('<h5 class="submit-advice-message failure">Need at least one tag</h5>')
  }
}

//////////////////////
//                  //
//  FORM Functions  //
//                  //
//////////////////////

// clearForms() clears form content and messages
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
  $('.choose-tags-message').text('')
}

// handleServerFail() displays a warning if like buttons, favorite buttons, or
// delete buttons fail due to a server action
const handleServerFail = () => {
  $('#adminApproveConfirmModal').modal('hide')
  $('#adminUnapproveConfirmModal').modal('hide')
  $('#adminDeleteConfirmModal').modal('hide')
  $('#deleteAdviceConfirmModal').modal('hide')
  $('#deleteFavoriteConfirmModal').modal('hide')
  $('#serverFailModal').modal('show')
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
  if (store.user.admin === 'true') {
    $('#admin-div').removeClass('collapse')
  }
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
  $('#sign-up-continue').addClass('collapse')
  $('#sign-up-submit').removeClass('collapse')
}

// handleSignOutSuccess() clears local data in store.js and resets the view if
// the user successfully signs out
const handleSignOutSuccess = () => {
  store.user = {
    id: 0,
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    token: '',
    tags: '',
    admin: ''
  }
  $('#signOutModal').modal('hide')
  $('#login-nav-button').removeClass('collapse')
  $('#sign-out-nav-button').addClass('collapse')
  $('#user-profile-nav-button').addClass('collapse')
  $('#submit-encouragement-nav-button').addClass('collapse')
  $('#advice-display').html('')
  $('#admin-div').addClass('collapse')
  $('body').attr('style', 'background-color: #8fd8d2;')
}

// handleSignOutFailure() displays an error if a sign-out attempt fails
const handleSignOutFailure = event => {
  $('.sign-out-message').html('<p class="failure">Failed to sign out</p>')
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
}

// handleSignUpMismatchingPasswords() displays an error if, when the user tries
// to sign up, the password and password_confirmation fields don't match
const handleSignUpMismatchingPasswords = event => {
  $('.sign-up-message').html('<h5 class="sign-up-message failure">Passwords do not match</h5>')
}

// handleSignUpNoTags() displays an error if there are no tags selected
const handleSignUpNoTags = () => {
  $('.sign-up-message').html('<h5 class="sign-up-message failure">Must select at least one tag</h5>')
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
const handleChangePasswordFailure = () => {
  $('.change-password-message').html('<h6 class="change-password-message failure">Invalid password</h6>')
}

// handleChangePasswordMismatchingPasswords() displays an error if the user
// tries to change their password, and the new password and
// new password confirmation fields don't match
const handleChangePasswordMismatchingPasswords = () => {
  $('.change-password-message').html('<h6 class="change-password-message failure">New passwords do not match</h6>')
}

// handleChangePasswordSuccess() displays a message when the user successfully
// changes their password
const handleChangePasswordSuccess = newPassword => {
  store.user.password = newPassword
  $('.change-password-message').html('<h6 class="change-password-message success">Password changed</h6>')
}

const handleShowFavoritesViewFailure = () => {
  $('.your-favorites-field').html(`<h6 class="failure">Couldn't load favorites</h6>`)
}

const handleShowUserViewFailure = () => {
  $('.your-submissions-field').html(`<h6 class="failure">Couldn't load submissions</h6>`)
}

// handleUpdateTagsFailure() displays an error if the user's tags fail to update
// on the API
const handleUpdateTagsFailure = () => {
  $('.choose-tags-message').html('<h6 class="choose-tags-message failure">Tags failed to update</h6>')
}

// handleUpdateTagsFailure() displays an error if the user tries to update tags
// but doesn't select any
const handleUpdateTagsNoTags = () => {
  $('.choose-tags-message').html('<h6 class="choose-tags-message failure">Must select at least one tag</h6>')
}

// handleUpdateTagsSuccess() displays if the user chooses tags and they update
// properly on the API
const handleUpdateTagsSuccess = () => {
  $('.choose-tags-message').html('<h6 class="choose-tags-message success">Tags updated!</h6>')
}

// refreshFavoritesUserView() closes the "delete favorite" confirmation modal
// and refreshes the favorites displayed in the USER view in the event
// something's been deleted
const refreshFavoritesUserView = advices => {
  $('#deleteFavoriteConfirmModal').modal('hide')
  showFavoritesUserView(advices)
}

// refreshFavoritesUserView() closes the "delete advice" confirmation modal
// and refreshes the advice displayed in the USER view in the event
// something's been deleted
const refreshUserView = advices => {
  $('#deleteConfirmModal').modal('hide')
  showUserView(advices)
}

// showFavoritesDiv() displays a div loaded with the pieces of advice the user
// has favorited if that tab is selected in the USER view
const showFavoritesDiv = () => {
  $('#settings-div').addClass('collapse')
  $('#your-favorites-div').removeClass('collapse')
  $('#your-submissions-div').addClass('collapse')
  $('#settings-nav-link').removeClass('active')
  $('#your-favorites-nav-link').addClass('active')
  $('#your-submissions-nav-link').removeClass('active')
}

// showFavoritesDiv() displays user settings (change password, update tags) when
// the setting tab is selected in the USER view
const showSettingsDiv = () => {
  $('#settings-div').removeClass('collapse')
  $('#your-favorites-div').addClass('collapse')
  $('#your-submissions-div').addClass('collapse')
  $('#settings-nav-link').addClass('active')
  $('#your-favorites-nav-link').removeClass('active')
  $('#your-submissions-nav-link').removeClass('active')
}

// showSubmissionsDiv() displays a div loaded with the pieces of advice the user
// has submmited when the "your submissions" tab is selected in the USER view
const showSubmissionsDiv = () => {
  $('#settings-div').addClass('collapse')
  $('#your-favorites-div').addClass('collapse')
  $('#your-submissions-div').removeClass('collapse')
  $('#settings-nav-link').removeClass('active')
  $('#your-favorites-nav-link').removeClass('active')
  $('#your-submissions-nav-link').addClass('active')
}

// showFavoritesUserView() loads up a div with the pieces of advice the user has
// favorited, formatted into a table
const showFavoritesUserView = data => {
  let newHTML = ''
  newHTML += `
  <table class="table text-center table-responsive submission-table">
    <thead class="thead-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Content</th>
        <th scope="col">Tags</th>
        <th scope="col">Upvotes</th>
        <th scope="col">Unfavorite?</th>
      </tr>
    </thead>
    <tbody>`
  let i = 0
  data.advices.forEach((element) => {
    i++
    newHTML += `
      <tr>
        <th scope="row">${i}</th>
        <td>${element.content}</td>
        <td>${element.tags.split(' ').join(', ').slice(0, -2)}</td>
        <td>${element.likes.length}</td>
        <td style="width: 22px;"><img src="public/images/delete.ico" style="width: 20px;" id="${element.id}" class="delete-favorite"></td>
      </tr>
    `
  })
  newHTML += `  </tbody>
  </table>`
  if (data.advices.length === 0) {
    newHTML = '<h6>You have not favorited any advice</h6>'
  }
  $('.your-favorites-field').html(newHTML)
  $('[data-toggle="tooltip"]').tooltip()
}

// showUserView() loads up a div with the pieces of advice the user has
// created, formatted into a table
const showUserView = data => {
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
    <tbody>`
  let i = 0
  data.advices.forEach((element) => {
    i++
    newHTML += `
      <tr>
        <th scope="row">${i}</th>
        <td>${element.content}</td>
        <td>${element.tags.split(' ').join(', ').slice(0, -2)}</td>
        <td>${element.likes.length}</td>
        <td>${element.approved}</td>
        <td style="width: 22px;"><img src="public/images/delete.ico" style="width: 20px;" id="${element.id}" class="delete-advice"></td>
      </tr>
    `
  })
  newHTML += `  </tbody>
  </table>`
  if (data.advices.length === 0) {
    newHTML = '<h6>You have no submissions</h6>'
  }
  $('.your-submissions-field').html(newHTML)
  $('[data-toggle="tooltip"]').tooltip()
}

module.exports = {
  // ADMIN UI Functions
  refreshAdminView,
  showAdminView,
  showAdminViewFail,
  showApprovedDiv,
  showUnapprovedDiv,
  // ADVICE UI Functions,
  addFavoriteDisplay,
  addLikeDisplay,
  deleteFavoriteDisplay,
  deleteLikeDisplay,
  displayAdvice,
  handleAdviceSubmissionFailure,
  handleAdviceSubmissionSuccess,
  handleLoggedInEncourageClickError,
  submitContentFailure,
  // FORM Functions
  clearForms,
  handleServerFail,
  // SIGN-IN/UP View UI Functions
  handleSignInSuccess,
  handleSignInFailure,
  handleSignInAfterSignUpFailure,
  handleSignInAfterSignUpSuccess,
  handleSignUpSuccess,
  handleSignUpFailure,
  handleSignUpMismatchingPasswords,
  handleSignUpNoTags,
  handleSignOutSuccess,
  handleSignOutFailure,
  resetLogInModal,
  switchToSignIn,
  switchToSignUp,
  // USER View UI Functions
  handleChangePasswordFailure,
  handleChangePasswordMismatchingPasswords,
  handleChangePasswordSuccess,
  handleShowFavoritesViewFailure,
  handleShowUserViewFailure,
  handleUpdateTagsFailure,
  handleUpdateTagsNoTags,
  handleUpdateTagsSuccess,
  refreshFavoritesUserView,
  refreshUserView,
  showFavoritesDiv,
  showSettingsDiv,
  showSubmissionsDiv,
  showFavoritesUserView,
  showUserView
}
