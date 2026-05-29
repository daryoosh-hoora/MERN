[test](https://www.google.com)

<a>curl -X POST http://localhost:4000/auth/login -H "Content-Type: application/json" -d '{ "email": "hoora@datis.one", "password": "datis.52" }'</a>

curl -X POST http://localhost:4000/users/register -H "Content-Type: application/json" -d '{"email":"user1@datis.one","password":"datis.52"}'

curl "http://localhost:4000/users?limit=10&offset=0"
curl "http://localhost:4000/users?limit=10&offset=0&role=user"

curl http://localhost:4000/users/3b3aeb70-1163-4061-8853-918f90089e8d

curl -X PUT http://localhost:4000/users/500c31f9-732e-43ab-9e87-e3c6b5c1ab93 -H "Content-Type: application/json" -d '{ "email": "new@email.com" }'

curl -X DELETE http://localhost:4000/users/500c31f9-732e-43ab-9e87-e3c6b5c1ab93 -H "Content-Type: application/json" -d '{ "permanently": "false" }'
