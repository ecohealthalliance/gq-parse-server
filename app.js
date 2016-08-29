import express from 'express';
import { ParseServer } from 'parse-server';
import settings from './settings';
import { resolve } from 'path';

process.env.VERBOSE=settings.verbose;

settings.emailAdapter.options.templates = {
  passwordResetEmail: {
    subject: 'GoodQuestion Reset your password',
    pathPlainText: resolve(__dirname, 'templates/password_reset_email.txt'),
    pathHtml: resolve(__dirname, 'templates/password_reset_email.html'),
    callback: (user) => { return { username: user.get('username') }},
  },
  verificationEmail: {
    subject: 'GoodQuestion Confirm your Account',
    pathPlainText: resolve(__dirname, 'templates/verification_email.txt'),
    pathHtml: resolve(__dirname, 'templates/verification_email.html'),
    callback: (user) => { return { username: user.get('username') }},
  },
  forgotPasswordEmail: {
    subject: 'GoodQuestion Forgot Password',
    pathPlainText: resolve(__dirname, 'templates/forgot_password_email.txt'),
    pathHtml: resolve(__dirname, 'templates/forgot_password_email.html'),
  },
  testEmail: {
    subject: 'GoodQuestion Test Email',
    pathPlainText: resolve(__dirname, 'templates/test_email.txt'),
    pathHtml: resolve(__dirname, 'templates/test_email.html'),
  },
};

const app = express();
const api = new ParseServer(settings);

// Serve the Parse API at /parse URL prefix
app.use('/parse', api);

const port = 1337;
app.listen(port, function() {
  console.log(`parse-server-example running on port: ${port}`);
});
