<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## توضیحات

پروژه میکروسرویس طراحی گردونه شانس است که شامل سرویس های زیر است:

- میکروسرویس احراز هویت
- میکروسرویس کاربران
- میکروسرویس پرداخت
- میکروسرویس ریفرال کد
- میکروسرویس امتیاز دهی
- میکروسرویس گردونه و جوایز
- ایجاد گیت وی برای درخواست کاربر
- در وضعیت pending استفاده از ردیس برای کش کردن پرداخت ها

## مرحله اول اجرای مایگریشن

```bash
$ npm run migration:install
```

## مرحله دوم اجرا برنامه با داکر

```bash
$ docker-compose up -d
```

## اجرای دستی بدون داکر

```bash

$ pnpm run start:api-gateway

$ pnpm run start:auth-service

$ pnpm run start:user-service

$ pnpm run start:referral-service

$ pnpm run start:score-mircorservice

$ pnpm run start:spinner-mircorservice

$ pnpm run start:payment-mircorservice

```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
