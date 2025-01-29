import { Buffer } from 'buffer';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as dotenvConfig } from 'dotenv';
import { UnauthorizedException } from '@nestjs/common';
// import metadata from '@base/metadata';

dotenvConfig({ path: '.env' });

export class SwaggerHelper {
  private basePath = process.env.SWAGGER_PATH || 'api-docs';
  private username = process.env.SWAGGER_USERNAME || 'admin';
  private password = process.env.SWAGGER_PASSWORD || 'admin';
  private title = process.env.SWAGGER_TITLE || 'API Documentation';
  private description = process.env.SWAGGER_DESCRIPTION || 'API description';

  setup(app) {
    if (!this.basePath || !this.username || !this.password) {
      console.error('Swagger Disabled : configuration missing ...');
      return;
    }

    const config = new DocumentBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setVersion('1.0.0')
      .addBearerAuth()
      .addGlobalParameters({
        name: 'Accept-Language',
        in: 'header',
        schema: {
          enum: ['en', 'fa'],
        },
      })
      .build();

    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use((request, reply, next) =>
      this.basicAuthInterceptor(request, reply, next),
    );

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(this.basePath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  getBasePath() {
    return this.basePath.startsWith('/') ? this.basePath : `/${this.basePath}`;
  }

  setError(reply: any, next: any) {
    console.log('Authorization Failed. Check username and password.');
    reply.header('WWW-Authenticate', 'Basic realm="Paraf" charset="UTF-8"');
    next(new UnauthorizedException());
  }

  basicAuthInterceptor(request: any, reply: any, next: any) {
    const url = request.url.split('?').shift().replace(/\/+$/, '');
    if (url !== this.getBasePath() && url !== `${this.getBasePath()}-json`) {
      next();
      return;
    }
    let credentials = request.headers['authorization'];
    if (typeof credentials !== 'string') {
      this.setError(reply, next);
      return;
    }
    credentials = credentials.replace('Basic ', '');
    const credentialsDecoded = Buffer.from(credentials, 'base64').toString(
      'utf-8',
    );
    const userPassRE = /^([^:]*):(.*)$/;
    const userPass = userPassRE.exec(credentialsDecoded);
    if (userPass[1] === this.username && userPass[2] === this.password) {
      console.log('Authorization Successful.');
      next();
      return;
    }
    this.setError(reply, next);
  }
}
