module.exports = {
  'facebookAuth' : {
    'clientID'      : process.env.FB_APP_ID,
    'clientSecret'  : process.env.FB_APP_SECRET,
    'callbackURL'   : 'http://localhost:8081/auth/facebook/callback'  // TODO: set url based on dev or production
  }
}
