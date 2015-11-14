- Implement HTTP cookie authentication addition.
- add methods for the own user to change.
- auth module methods: return useful error values. (Sample: changeUsername: 'already_exists')

## General:
- Implement protocol version check.
- Provide a register user module/method.
- Add more testing.

## Security:
- DDOS prevention.

## Database
- Combine the gorethink database logging with the BitMonster logging.

## Authentication
- Implement E-Mail verification. Also on registration.
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
