# User Auth Process

This is a simple user authentication where the user can sign up, login, logout. The user has to confirm his/her email to complete the sign up process. This user auth also includes jwt to secure the process.

## Run Locally

Clone the project

```bash
  git clone https://github.com/rapnavalez/userauth
```

Go to the project directory

```bash
frontend
  cd userauth
backend
  cd backend
```

Install dependencies

```bash
  npm install
```

```bash
  node -v v16.14.2
```

Start the server

```bash
  npm start
```

Ports

```bash
3000 for frontend
5000 for backend
```

## Documentation

### Sign Up

The user has go to `http://localhost:3000/signup` to fill out an signup form. The password has to match to be able to submit the form. The server will do the validation for the name, email, and password.

After signing up, a user will be created user `userSchema` with `{ isVerified: false }`. An email containing the confirmation token will be sent to the email address that was used to register. The confirmation token is valid for 864000 seconds (10 days). After visiting the link, the server would validate the token, and if it is valid, the `isVerified` would be set to `true` and the token would be deleted from the `tokenSchema`.

#### Confirmation email

If the user lost the confirmation email or the token has expired before they used it. The user can request a new confirmation email at `http://localhost:3000/confirmationemail` the link to this would be present if the user clicked on an expired confirmation link or if the user tried to login without confirming the email.
Client side validation is present in checking if the user is submiting a valid email, and server side validation would be preset if the email is already active or is present in the db.

### Login

The user can login `http://localhost:3000/login`. The validation is done on server side checking if the email exist and the password is correct. If the user entered an incorrect credentials the server would respond with a vague error message `email or password is incorrect`. If the user entered an email that is yet to be verified, the user would be prompted to verify the email. Upon successful login, a cookie(http) would be created containing the jwt token. A `fetchUser` function would be triggered to fetch the user relative to the jwt token that was saved in cookie.

##### Bug Fix

There are times esp. when first time login, the login method is already done but the user isn't displayed yet. Added loading animation, and removed navigate during login method. Routes will take care of re-routing once the user info is ready.

### Logout

The user can click the `logout` button. It will delete the cookie and set the `userStatus` to `false`

### Password Reset

The user can click the password reset link on the login page to request for a password reset link. After entering a valid email, an email will be sent to the user containing the link for the password reset. After clicking the link, the user can enter a new password. If the change was a success, the user will be redirected to the login page.
