import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
// import cookieSession from 'cookie-session';
import compression from 'compression';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import { config } from '@root/config';
import applicationRoutes from '@root/routes';
import Logger from 'bunyan';
import { IErrorResponse, CustomError } from '@global/helpers/error-handler';


const SERVER_PORT = 9090;
const log: Logger = config.createLogger('server');

export class ChattyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    // app.use(
    //   cookieSession({
    //     name: 'session',
    //     keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
    //     maxAge: 24 * 7 * 3600000,
    //     secure: config.NODE_ENV !== 'development',
    //   }),
    // );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routeMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: `${req.originalUrl} not found.`,
      });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
        log.error(error);
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
      },
    );
  }

  private async startServer(app: Application): Promise<void> {
    // if (!config.JWT_TOKEN) {
    //   throw new Error('JWT_TOKEN must be provided')
    // }
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.error(error);
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`Worker with process id of ${process.pid} has started...`);
    log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`);
    });
  }
}
