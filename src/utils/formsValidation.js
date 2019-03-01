import axios from 'axios';

const firstNameForm = /^([a-zA-Z]){3,30}$/;
const lastNameForm = /^([a-zA-Z]){3,30}$/;
const usernameForm = /^([a-zA-Z0-9]){3,30}$/;
const emailForm = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const signupValidate = values => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword
  } = values;

  const fields = [
    'firstName',
    'lastName',
    'username',
    'email',
    'password',
    'confirmPassword'
  ];
  const errors = {};

  fields.forEach(field => {
    if (!values[field]) {
      errors[field] = `Required`;
    }
  });

  if (!firstNameForm.test(firstName))
    errors.firstName = 'Alphabet characters between 3 and 30';
  if (!lastNameForm.test(lastName))
    errors.lastName = 'Alphabet characters between 3 and 30';
  if (!usernameForm.test(username))
    errors.username = 'Alphanumeric characters between 3 and 30';
  if (!emailForm.test(email)) errors.email = 'Invalid email';

  if (password !== confirmPassword)
    errors.confirmPassword = 'Passwords does not match';

  return errors;
};

const asyncValidate = ({ username, email }) => {
  if (!username && !email) return Promise.resolve();

  return axios
    .post('/auth/isitavailable', {
      username,
      email
    })
    .then(res => {
      if (!res.data.success) {
        let errors = {};

        if (!res.data.username) {
          errors.username = `${username} already in use`;
        }
        if (!res.data.email) {
          errors.email = `${email} already in use`;
        }

        throw errors;
      }
    });
};

const profileValidate = values => {
  const {
    firstName,
    lastName,
    username,
    email,
    currentPassword,
    newPassword,
    confirmNewPassword
  } = values;

  const errors = {};

  if (firstName || lastName || username) {
    if (!firstNameForm.test(firstName))
      errors.firstName = 'Alphabet characters between 3 and 30';
    if (!lastNameForm.test(lastName))
      errors.lastName = 'Alphabet characters between 3 and 30';
    if (!usernameForm.test(username))
      errors.username = 'Alphanumeric characters between 3 and 30';
  }
  if (email) if (!emailForm.test(email)) errors.email = 'Invalid email';

  if (currentPassword || newPassword || confirmNewPassword) {
    if (currentPassword && !newPassword)
      errors.newPassword = 'Required for changing your password';
    if (!currentPassword)
      errors.currentPassword = 'Required for changing your password';
    if (newPassword !== confirmNewPassword)
      errors.confirmNewPassword = 'Passwords does not match';
  }

  if (Object.getOwnPropertyNames(values).length === 0)
    errors.confirmNewPassword = 'Nothing to update';

  return errors;
};

export { signupValidate, asyncValidate, profileValidate };
