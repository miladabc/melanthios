import axios from 'axios';

const API_URI = process.env.REACT_APP_API_URI;

const validate = values => {
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

  const firstNameForm = /^([a-zA-Z]){3,30}$/;
  const lastNameForm = /^([a-zA-Z]){3,30}$/;
  const usernameForm = /^([a-zA-Z0-9]){3,30}$/;
  const emailForm = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
  return axios
    .post(`${API_URI}/auth/isitavailable`, {
      username,
      email
    })
    .then(response => {
      if (!response.data.success) {
        let errors = {};

        if (response.data.field === 'username') {
          errors.username = `${username} already in use`;
        }
        if (response.data.field === 'email') {
          errors.email = `${email} already in use`;
        }

        throw errors;
      }
    });
};

export { validate, asyncValidate };
