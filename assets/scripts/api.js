// api.js

/* This document is organized into the following sections:

(1) ADVICE API Actions
(2) USER API Actions */

const config = require('./config.js')
const store = require('./store.js')

//////////////////////////
//                      //
//  ADVICE API actions  //
//                      //
//////////////////////////

const submitAdviceToAPI = data => {
  console.log('Inside submitAdviceToAPI--data is', data)
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

module.exports = {
  // ADVICE API action
  submitAdviceToAPI,
  // USER API actions
  changePassword,
  signIn,
  signOut,
  signUp
}
