'use strict'

/*
TO-DO LIST:

1. Refactor code so that when Admin makes changes to advice, there's only one
update route that's used?
2. Animations?
3. Clean up and comment code
4. Check breakpoints and other display sizes
5. Check errors handlers--right now you console.log errors a lot
6. If you close the USER view, it doesn't refresh the "Tags updated!" message
7. The tag check boxes in the USER view are blank by default; it'd be good if they defaulted to the current user's tags
8. What happens if the user only selects tags for which no pieces of advice exist? Display "error" or warning?
9. If user has no submissions or favorites, display some message instead of just a blank div?
*/

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

const events = require('./events.js')
const ui = require('./ui.js')

$(() => {
  $('#admin-delete-item-submit').on('click', events.onAdminDeleteConfirm)
  $('#admin-approve-item-submit').on('click', events.onAdminApproveConfirm)
  $('#admin-unapprove-item-submit').on('click', events.onAdminUnapproveConfirm)
  $('#adminModal').on('show.bs.modal', events.onShowAdminView)
  $('#approved-submissions-nav-link').on('click', ui.showApprovedDiv)
  $('#change-password-submit').on('click', events.onChangePasswordSubmit)
  $('[data-toggle="tooltip"]').tooltip()
  $('#delete-favorite-submit').on('click', events.onDeleteFavoriteConfirm)
  $('#delete-item-submit').on('click', events.onDeleteConfirm)
  $('#encourage-button').on('click', events.onFirstEncourageClick)
  $('#logInModal').on('show.bs.modal', ui.resetLogInModal)
  $('#settings-nav-link').on('click', ui.showSettingsDiv)
  $('#sign-in-submit').on('click', events.onSignIn)
  $('#sign-out-submit').on('click', events.onSignOut)
  $('#sign-up-submit').on('click', events.onSignUp)
  $('#sign-up-continue').on('click', events.onSignUpContinue)
  $('#submit-advice-submit').on('click', events.onAdviceSubmission)
  $('#switch-to-sign-in').on('click', events.onSwitchToSignIn)
  $('#switch-to-sign-up').on('click', events.onSwitchToSignUp)
  $('#unapproved-submissions-nav-link').on('click', ui.showUnapprovedDiv)
  $('#user-view-done').on('click', events.refreshAdvice)
  $('#user-view-done').on('click', ui.clearForms)
  $('#userViewModal').on('show.bs.modal', events.onShowUserView)
  $('#userViewModal').on('show.bs.modal', events.onShowUserFavoritesView)
  $('#user-choose-tags-submit').on('click', events.onUserChooseTagsSubmit)
  $('#your-favorites-nav-link').on('click', ui.showFavoritesDiv)
  $('#your-submissions-nav-link').on('click', ui.showSubmissionsDiv)
})
