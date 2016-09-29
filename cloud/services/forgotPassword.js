import { ForgotPassword } from '../models/ForgotPassword';

/**
 * Gets the User from a specified username
 * @param {string} code, the id of the ForgotPassword record
 * @param {function} done, Callback function which returns a Parse.User object or error
 */
export function getForgotPassword(code, done) {
  const query = new Parse.Query(ForgotPassword);
  query.get(code)
  .then(
    (forgotPassword) => {
      if (forgotPassword) {
        return done(null, forgotPassword);
      }
      done('Invalid code ID.');
    },
    (err) => {
      if (err.hasOwnProperty('message')) {
        return done(err.message);
      }
      done(err);
    }
  );
}
