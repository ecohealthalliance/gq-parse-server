import { ForgotPassword, STATUS } from '../models/forgotPassword';

/**
 * Gets the User from a specified username
 * @param {string} token, the id of the ForgotPassword record
 * @param {function} done, Callback function which returns a Parse.User object or error
 */
export function getForgotPassword(token, done) {
  const query = new Parse.Query(ForgotPassword);
  query.get(token)
  .then(
    (forgotPassword) => {
      if (forgotPassword) {
        return done(null, forgotPassword);
      }
      done('Invalid token ID.');
    },
    (err) => {
      if (err.hasOwnProperty('message')) {
        return done(err.message);
      }
      done(err);
    }
  );
}
