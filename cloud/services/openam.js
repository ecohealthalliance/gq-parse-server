import fetch from 'node-fetch';
import settings from '../../settings';

const openam = {
  baseUrl: settings.openam.baseUrl,
  authPath: '/openam/json/authenticate?Content-Type=application/json',
  regPath: '/openam/json/users/?_action=create',
  changePasswordPath: (username) => `/openam/json/users/${username}?_action=changePassword`,
  forcePasswordPath: (username) => `/openam/json/users/${username}`,
};

/**
 *
 * OpenAm admin authentication to get session of authorized user who is capable
 * of creating user accounts.
 *
 * @param {string} username, the username to authenticate on openam
 * @param {string} password, the password to authenticate on openam
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function openamAuth(username, password, done) {
  const authConfig = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-OpenAM-Username': username,
      'X-OpenAM-Password': password,
    },
  };
  const url = openam.baseUrl + openam.authPath;
  fetch(url, authConfig).then((res) => {
    return res.text();
  }).then((responseText) => {
    const jsonData = JSON.parse(responseText);
    if (!jsonData.hasOwnProperty('tokenId')) {
      if (jsonData.hasOwnProperty('message')) {
        done(jsonData.message);
        return;
      }
      done('Unauthorized');
    }
    done(null, jsonData.tokenId);
  }).catch(() => {
    done('Unauthorized');
  });
}

/**
 *
 * OpenAm change a users password
 *
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function openamChangePassword(tokenId, username, currentPassword, newPassword, done) {
  const authConfig = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'iPlanetDirectoryPro': tokenId,
    },
    body: JSON.stringify({
      'currentpassword': currentPassword,
      'userpassword': newPassword,
    }),
  };
  const url = openam.baseUrl + encodeURI(openam.changePasswordPath(username));
  fetch(url, authConfig).then((res) => {
    if (typeof res === 'undefined') {
      throw new Error('Bad Request.');
    }
    return res.text();
  }).then((responseText) => {
    const jsonData = JSON.parse(responseText);
    // Forgerock does not provide descriptive errors for authorized requests
    // that failed changePassword, such as meeting minimum complexity requirements
    // or other password policies.
    // https://bugster.forgerock.org/jira/browse/OPENAM-6867
    if (jsonData.hasOwnProperty('code') && jsonData.code !== 200) {
      done(jsonData.message);
      return;
    }
    done(null, true);
  }).catch(() => {
    done('Unauthorized');
  });
}

/**
 *
 * OpenAm force new password as admin user
 *
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function openamForcePassword(tokenId, username, newPassword, done) {
  const authConfig = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'iPlanetDirectoryPro': tokenId,
    },
    body: JSON.stringify({
      'userpassword': newPassword,
    }),
  };
  const url = openam.baseUrl + encodeURI(openam.forcePasswordPath(username));
  fetch(url, authConfig).then((res) => {
    if (typeof res === 'undefined') {
      throw new Error('Bad Request.');
    }
    return res.text();
  }).then((responseText) => {
    const jsonData = JSON.parse(responseText);
    // Forgerock v12 is unable to change a user password using the admin token
    // https://bugster.forgerock.org/jira/browse/OPENAM-6443
    if (jsonData.hasOwnProperty('code') && jsonData.code !== 200) {
      done(jsonData.message);
      return;
    }
    done(null, true);
  }).catch((err) => {
    if (err.hasOwnProperty('message')) {
      done(err.message);
      return;
    }
    done(err);
  });
}
