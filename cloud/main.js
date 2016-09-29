import async from 'async';

import settings from '../settings';

import { getUser, parseForcePassword } from './services/user';
import { sendTest, sendForgotPassword } from './services/email';
import { getForgotPassword } from './services/forgotPassword';
import { openamAuth, openamForcePassword } from './services/openam';
import { ForgotPassword, STATUS } from './models/ForgotPassword';

/**
 * responds with the value of request.params.message
 *
 * @param {string} request.params.message, the message to echo
 */
Parse.Cloud.define('echo', (request, response) => {
  const message = request.params.message;
  response.success(message);
});

/**
 * sends a test email to the specified request.params.email address
 *
 * @param {string} request.params.email, the email address to send
 */
Parse.Cloud.define('testEmail', (request, response) => {
  if (!request.master) {
    response.error('Unauthorized.');
    return;
  }
  async.auto({
    getUser: (cb) => {
      getUser(request.params.email, cb);
    },
    sendTestEmail: ['getUser', (results, cb) => {
      sendTest(results.getUser, cb);
    }],
  }, (err, results) => {
    if (err) {
      response.error(err);
      return;
    }
    response.success(results.email);
  });
});

/**
 * creates a forgotPassword code and sends email to address specified
 *
 * @param {string} request.params.email, the email address to send
 */
Parse.Cloud.define('createForgotPassword', (request, response) => {
  if (!request.master) {
    response.error('Unauthorized.');
    return;
  }
  async.auto({
    getUser: (cb) => {
      getUser(request.params.email, cb);
    },
    createForgotPassword: ['getUser', (results, cb) => {
      ForgotPassword.create(results.getUser, cb);
    }],
    sendForgotPasswordEmail: ['createForgotPassword', (results, cb) => {
      sendForgotPassword(results.getUser, results.createForgotPassword, cb);
    }],
  }, (err) => {
    if (err) {
      response.error(err);
      return;
    }
    response.success(true);
  });
});

/**
 * verifies a forgotPassword code and set the password to the value specified
 *
 * @param {string} request.params.email, the email address of the user
 * @param {string} request.params.code, the forgotPassword code
 * @param {string} request.params.newPassword, the new password for the account
 */
Parse.Cloud.define('verifyForgotPassword', (request, response) => {
  if (!request.master) {
    response.error('Unauthorized.');
    return;
  }
  async.auto({
    // get the user object
    getUser: (cb) => {
      getUser(request.params.email, cb);
    },
    // get the forgotPassword object
    getForgotPassword: ['getUser', (results, cb) => {
      getForgotPassword(request.params.code, cb);
    }],
    // validate that the forgotPassword code belongs to the user and hasn't been used
    validate: ['getForgotPassword', (results, cb) => {
      const forgotPassword = results.getForgotPassword;
      if (forgotPassword.validate(results.getUser.id)) {
        cb(null, true);
      } else {
        cb('Expired code.');
      }
    }],
    // authenticate against openam as an admin
    openamAuth: ['validate', (results, cb) => {
      if (settings.openam.disabled) {
        cb(null, null);
        return;
      }
      openamAuth(settings.openam.email, settings.openam.password, cb);
    }],
    // force a password change on openam with the admin token
    openamForcePassword: ['openamAuth', (results, cb) => {
      if (settings.openam.disabled) {
        cb(null, null);
        return;
      }
      const tokenId = results.openamAuth;
      const username = results.getUser.get('username');
      const newPassword = request.params.newPassword;
      openamForcePassword(tokenId, username, newPassword, cb);
    }],
    // force a password change on parse-server using masterKey
    parseForcePassword: ['openamForcePassword', (results, cb) => {
      parseForcePassword(results.getUser, request.params.newPassword, (err, user) => {
        if (err) {
          // if saving to parse fails we must rollback the password on Forgerock
          const tokenId = results.openamAuth;
          const username = results.getUser.get('username');
          const newPassword = request.params.newPassword;
          openamForcePassword(tokenId, username, newPassword, (err) => {
            // if the rollback fails the user will need to contact an
            // administrator to get their passwords to match in both Forgerock
            // and Parse Server.
            if (err) {
              cb({
                message: 'Your account has been locked. Please email: \ngoodquestion@ecohealthalliance.org',
              });
              return;
            }
            cb({
              message: 'Could not update your password.',
            });
          });
          return;
        }
        cb(null, user);
      });
    }],
    // we made it this far, mark the forgotPassword object as STATUS.used
    markUsed: ['parseForcePassword', (results, cb) => {
      const forgotPassword = results.getForgotPassword;
      forgotPassword.set('status', STATUS.used);
      forgotPassword.save().then(
        () => {
          cb(null, forgotPassword);
        },
        (err) => {
          cb(err);
        }
      );
    }],
  }, (error, results) => {
    if (error) {
      if (error.hasOwnProperty('message')) {
        respon.error(error.message);
        return;
      }
      response.error(error);
      return;
    }
    response.success(true);
  });
});
