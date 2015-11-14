- Implement HTTP cookie authentication addition.
- add methods for the own user to change.

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
- Implemented key rotation (SecureCookie).
- Rotate authentication tokens on login?
- Simple DDOS and Bruteforce prevention.

## Feature Requests
- Improve the database migration tool.
- Automatically generate a developers API for the JSON requests.
