import cors from 'cors';
import express, { type Router } from 'express';
import logger from 'morgan';

type StartServerProps = {
  port: string;
  logLevel: string;
  router: Router;
};

export const startServer = async ({ port, logLevel, router }: StartServerProps): Promise<void> => {
  const app = express();
  const server = app
    .use(express.json({ limit: '50mb' }))
    .use(cors())
    .use(getLogger(logLevel))
    .use(router)
    .listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  process.on('SIGINT', () => {
    server.close();
    console.log('Server process ended.');
  });
};

export const getLogger = (logLevel: string) => {
  switch (logLevel) {
    case 'debug':
      return logger('combined');
    case 'dev':
      return logger('dev');
    case 'prod':
      return logger('combined', {
        skip: (_, res) => res.statusCode < 400,
      });
    default:
      return logger('dev', {
        skip: (_, res) => res.statusCode < 400,
      });
  }
};
