export const STATUS = {
  new: 'new',
  used: 'used',
};
const useMasterKey = {useMasterKey: true};

export const ForgotPassword = Parse.Object.extend('ForgotPassword', {
  /**
   * Validates the model for the user and STATUS.new
   *
   * @param {string} userId, the id of the Parse.User
   */
  validate: function (userId) {
    if (this.get('status') === STATUS.new && this.get('userId') === userId) {
      return true;
    }
    return false;
  },
});


/**
 * factory method to create a ForgotPassword record
 *
 * @param {object} user, the Parse.User
 */
ForgotPassword.create = (user, done) => {
  const forgotPassword = new ForgotPassword();
  forgotPassword.set('userId', user.id);
  forgotPassword.set('status', STATUS.new);
  forgotPassword.set('date', new Date());
  const acl = new Parse.ACL();
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, true);
  acl.setRoleReadAccess('admin', true);
  acl.setRoleWriteAccess('admin', true);
  forgotPassword.setACL(acl);
  forgotPassword.save(null, useMasterKey)
  .then(
    () => {
      user.relation('forgotPasswords').add(forgotPassword);
      user.save(null, useMasterKey);
      done(null, forgotPassword);
    },
    (err) => {
      done(err);
    }
  )
  .fail(function(err) {
    done(err);
  });
}
