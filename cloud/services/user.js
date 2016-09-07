import { ForgotPassword, STATUS } from '../models/ForgotPassword';

/**
 * Gets the User from a specified username
 * @param {string} username, username of the user
 * @param {function} done, Callback function which returns a Parse.User object or error
 */
export function getUser(username, done) {
  Parse.Cloud.useMasterKey();
  const query = new Parse.Query(Parse.User);
  query.equalTo('username', username);
  query.first(
    (user) => {
      if (user) {
        done(null, user);
        return;
      }
      done('Invalid user');
    },
    (err) => {
      if (err.hasOwnProperty('message')) {
        done(err.message);
        return;
      }
      done(err);
    }
  );
}

/**
 * forces a new password using masterKey
 *
 * @param {string} username, username of the user
 * @param {string} password, the new password
 * @param {function} done, callback function which returns a Parse.User object or error
 */
export function parseForcePassword(user, password, done) {
  Parse.Cloud.useMasterKey();
  user.set('password', password);
  user.save().then(
    () => {
      done(null, user);
    },
    (err) => {
      if (err.hasOwnProperty('message')) {
        done(err.message);
        return;
      }
      done(err);
    }
  ).fail(
    (err) => {
      done(err);
    }
  );
}
