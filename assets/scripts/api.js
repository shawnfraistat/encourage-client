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

const approveAdviceOnAPI = id => {
  return $.ajax({
    url: config.apiUrl + '/advices/' + id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const unapproveAdviceOnAPI = id => {
  return $.ajax({
    url: config.apiUrl + '/advices/unapprove/' + id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

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

const addUpvote = data => {
  return $.ajax({
    url: config.apiUrl + '/likes/' + data.id,
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const deleteUpvote = data => {
  return $.ajax({
    url: config.apiUrl + '/likes/' + data.id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const addFavorite = data => {
  return $.ajax({
    url: config.apiUrl + '/favorites/' + data.id,
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const deleteFavorite = data => {
  return $.ajax({
    url: config.apiUrl + '/favorites/' + data.id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const deleteAdviceFromAPI = id => {
  return $.ajax({
    url: config.apiUrl + '/advices/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

// const checkLikesOnAdviceFromAPI = () => {
//   return $.ajax({
//     url: config.apiUrl + '/random-advice',
//     method: 'GET',
//     headers: {
//       Authorization: 'Token token=' + store.user.token
//     }
//   })
// }

const getAdviceFromAPI = () => {
  return $.ajax({
    url: config.apiUrl + '/random-advice',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const getSpecificAdviceFromAPI = id => {
  return $.ajax({
    url: config.apiUrl + '/advices/' + id,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const getUserFavoritesFromAPI = () => {
  console.log('Inside getUserFavoritesFromAPI')
  return $.ajax({
    url: config.apiUrl + '/get-favorites/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const getUserAdvicesFromAPI = () => {
  return $.ajax({
    url: config.apiUrl + '/users/' + store.user.id,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

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
