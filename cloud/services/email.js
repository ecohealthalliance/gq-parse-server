import settings from '../../settings';

import { ForgotPassword, STATUS } from '../models/ForgotPassword';
import { AppCache } from 'parse-server/lib/cache';

/**
 * Sends a custom test email.
 * @param
 */
export function sendTest(user, done) {
  const adapter = AppCache.get(settings.appId)['userController']['adapter'];
  if (typeof adapter === 'undefined') {
    done(new Error('Invalid mail adapter.'));
    return;
  }
  adapter.send({
    templateName: 'testEmail',
    recipient: user.get('username'),
    variables: { username: user.get('username') },
  })
  .then(
    function(body) {
      done(null, body);
    }
  ).catch(
    function(err) {
      done(err);
    }
  );
}

/**
 * Sends an email based on a template name.
 * @param {object} user, parse User model
 * @param {function} done, Callback function which returns an array of Parse 'Form' objects
 */
export function sendForgotPassword(user, forgotPassword, done) {
  const adapter = AppCache.get(settings.appId)['userController']['adapter'];
  if (typeof adapter === 'undefined') {
    done(new Error('Invalid mail adapter.'));
    return;
  }
  const username = user.get('username');
  const token = forgotPassword.id;
  const link = `${settings.emailAdapter.redirectUrl}/verifyForgotPassword?email=${username}&token=${token}`;
  adapter.send({
    templateName: 'forgotPasswordEmail',
    fromAddress: settings.emailAdapter.fromAddress,
    recipient: username,
    variables: { username, token, link },
  }).then(
    (body) => {
      done(null, body);
    }
  ).catch(
    (err) => {
      done(err);
    }
  );
}
