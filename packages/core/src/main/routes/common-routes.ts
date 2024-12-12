import { type Request, type Response, Router } from 'express';

type CommonRoutesProps = {
  serviceName: string;
  serviceVersion: string;
};

export const getCommonRoutes = ({ serviceName, serviceVersion }: CommonRoutesProps): Router => {
  const router = Router();

  router.get('/', (_: Request, res: Response) => {
    res.send({
      serviceName: serviceName,
      version: serviceVersion,
    });
  });

  router.get('/healthCheck', (_: Request, res: Response): void => {
    res.status(200).json({ message: 'healthy' });
  });

  return router;
};
