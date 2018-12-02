// api.js

/* This document is organized into the following sections:

(1) ADMIN API Actions
(2) ADVICE API Actions
(3) USER API Actions */

const config = require('./config.js')
const store = require('./store.js')

/////////////////////////
//                     //
//  ADMIN API actions  //
//                     //
/////////////////////////

// approveAdviceOnAPI() is called when an admin approves a piece of advice;
// the advice's approval status is then updated on the API
const approveAdviceOnAPI = id => {
  return $.ajax({
    url: config.apiUrl + '/advices/' + id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// unapproveAdviceOnAPI() is called when an admin removes approval from advice;
// the advice's approval status is then updated on the API
const unapproveAdviceOnAPI = id => {
  return $.ajax({
    url: config.apiUrl + '/advices/unapprove/' + id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// getAllAdvicesFromAPI() is used to retrieve every piece of advice from the API
// so that it can be displayed to the admin
const getAllAdvicesFromAPI = () => {
  return $.ajax({
    url: config.apiUrl + '/advices/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

//////////////////////////
//                      //
//  ADVICE API actions  //
//                      //
//////////////////////////

// addUpvote() is called when a user approves a piece of advice
// it uses the current user's id and the id of the advice in question to create
// a new like instance
const addUpvote = data => {
  return $.ajax({
    url: config.apiUrl + '/likes/' + data.id,
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// deleteUpvote() is called when a user "unlikes" a piece of advice they'd
// previously liked; it destroys that like on the API
const deleteUpvote = data => {
  return $.ajax({
    url: config.apiUrl + '/likes/' + data.id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// addFavorite() is called when a user favorites a piece of advice
// it uses the current user's id and the id of the advice in question to create
// a new favorite instance
const addFavorite = data => {
  return $.ajax({
    url: config.apiUrl + '/favorites/' + data.id,
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// deleteFavorite() is called when a user "unfavorites" a piece of advice they'd
// previously favorited; it destroys that favorite on the API
const deleteFavorite = data => {
  return $.ajax({
    url: config.apiUrl + '/favorites/' + data.id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// deleteAdviceFromAPI() removes a piece of advice from the API if a user
// deletes it
const deleteAdviceFromAPI = id => {
  return $.ajax({
    url: config.apiUrl + '/advices/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// getAdviceFromAPI() is called when the ENCOURAGE button is pressed by a
// logged-in user. It gets a random piece of advice from the API to display.
const getAdviceFromAPI = () => {
  return $.ajax({
    url: config.apiUrl + '/random-advice',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// getSpecificAdviceFromAPI() is called when a particular piece of advice needs
// to be retrieved, one that's designated by ID number
const getSpecificAdviceFromAPI = id => {
  return $.ajax({
    url: config.apiUrl + '/advices/' + id,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// getUserAdvicesFromAPI() retrieves everything a given user has favorited
const getUserFavoritesFromAPI = () => {
  return $.ajax({
    url: config.apiUrl + '/get-favorites/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// getUserAdvicesFromAPI() returns the pieces of advice the current user has
// created
const getUserAdvicesFromAPI = () => {
  return $.ajax({
    url: config.apiUrl + '/users/' + store.user.id,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// submitAdviceTOAPI() sends a new piece of advice to the API
const submitAdviceToAPI = data => {
  return $.ajax({
    url: config.apiUrl + '/advices',
    method: 'POST',
    data,
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

////////////////////////
//                    //
//  USER API actions  //
//                    //
////////////////////////

// changePassword() is used to update the API to change a user's password
const changePassword = data => {
  return $.ajax({
    url: config.apiUrl + '/change-password',
    method: 'PATCH',
    data,
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// signIn() logs in an existing user on the API, returning an authentication
// token
const signIn = data => {
  return $.ajax({
    url: config.apiUrl + '/sign-in',
    method: 'POST',
    data
  })
}

// signOut() logs a signed-in usr out
const signOut = () => {
  return $.ajax({
    url: config.apiUrl + '/sign-out',
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// signUp() creates a new user on the API
const signUp = data => {
  return $.ajax({
    url: config.apiUrl + '/sign-up',
    method: 'POST',
    data
  })
}

// updateUserTags() updates the tags associated with this user on the API
const updateUserTags = data => {
  return $.ajax({
    url: config.apiUrl + '/change-tags',
    method: 'PATCH',
    data,
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

module.exports = {
  // ADMIN API actions
  approveAdviceOnAPI,
  getAllAdvicesFromAPI,
  unapproveAdviceOnAPI,
  // ADVICE API actions
  addFavorite,
  addUpvote,
  deleteFavorite,
  deleteUpvote,
  deleteAdviceFromAPI,
  getAdviceFromAPI,
  getSpecificAdviceFromAPI,
  getUserAdvicesFromAPI,
  getUserFavoritesFromAPI,
  submitAdviceToAPI,
  // USER API actions
  changePassword,
  signIn,
  signOut,
  signUp,
  updateUserTags
}
