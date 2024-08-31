# Fullstack Case

This is a Full-Stack Blog App project that uses Next.js for Frontend and Laravel11 for Backend API and MYSQL for database. They are deployed with Docker.


## INSTALLATION

`git clone https://github.com/oguzcanco/Fullstack-Case.git`

Check Backend .env For Mysql configuration
```
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=blogdb
DB_USERNAME=laraveluser
DB_PASSWORD=laravelpassword
```

Check Frontend .env.local For Network connection
```
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_MIDDLEWARE_API_URL=http://laravel:8001/api
```

Start Docker Containers
`docker-compose up -d`

Laravel Key generate
`docker exec laravel php artisan key:generate`
Laravel Migrate && Seed
```
docker exec php artisan migrate
docker exec php artisan db:seed
```

Now you can access Frontend app: http://localhost:3000/
Backend Api: http://127.0.0.1:8001/api/example
