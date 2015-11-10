- Implement HTTP cookie authentication addition.
- Auth module: events, remove user, add user, change password, getters
- Implement protocol version check.

## General:
- Add more testing.

## Security:
- DDOS prevention.

## Database
- Combine the gorethink database logging with the BitMonster logging.

## Authentication
- Implement E-Mail verification. Also on registration.
- Add an alternative method to GetUsers, which obtains a partial list of users (batched list).
- Implemented key rotation (SecureCookie).
- Rotate authentication tokens on login?
- Simple DDOS and Bruteforce prevention.

## Feature Requests
- Improve the database migration tool.
- Automatically generate a developers API for the JSON requests.
