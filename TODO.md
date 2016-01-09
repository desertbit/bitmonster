- auth.js: merge the auth token and the auth data into a single encrypted string which is saved together in the local storage. Remove it and invalidate it if something failed.
- Add a cache and hot cache.
- Events are bound twice due to the connected_and_auth internal event?
- Implement HTTPS2
- Error callback for events
- Implement a bitmonster cache object which listens for changefeeds...
- Create auth README with JSON requests and return data.
- Implement firewall module with hooks to protect against ddos. Add these hooks to the auth package.
- auth module methods: return useful error values. (Sample: changeUsername: 'already_exists')

## General:
- Reduce the password iterations of the client side token encryption
- Implement protocol version check.
- Provide a register user module/method.
- Add more testing.

## Security:
- DDOS prevention.
- Add support for a custom pin in the client javascript code to encrypt the authentication token, instead of just using the fingerprint.

## Database
- Combine the gorethink database logging with the BitMonster logging.

## Authentication
- HTTP authentication: add random token which is confirmed by the authentication module method.
- Implement E-Mail verification. Also on registration.
- Verify the E-Mail set by the current user by sending an e-mail. (editCurrentUser)
- Add an alternative method to GetUsers, which obtains a partial list of users (batched list).
- Remove sensitive BCrypt hashes from error messages (gorethink errors).
- Simple DDOS and Bruteforce prevention.
- Implemented key rotation (SecureCookie)?
- Rotate authentication tokens on login?

## Fix hacks for unique secondary indexes.
See: https://github.com/rethinkdb/rethinkdb/issues/1716
The **AddUser** and **ChangeUsername** methods of the auth module implement dirty hacks to solve the limitation of unique secondary indexes of RethinkDB. These hacks work for single BitMonster server instances, but on Cluster setups, the local mutex locks don't work.

Possible fixes:
- Implement a network service which provides a cluster wide mutex lock store.
- Wait for support in RethinkDB for unique secondary indexes.
- Use an additional table which store the usernames as primary indexes.

## Feature Requests
- Improve the database migration tool.
- Automatically generate a developers API for the JSON requests.
