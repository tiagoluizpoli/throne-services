import { type ValueProvider, container } from 'tsyringe';
import type { RegistrationOptions, constructor } from 'tsyringe/dist/typings/types';

const log = (token: string, provider: string) => {
  console.debug(
    `${new Date().toLocaleString('pt-br')} :: registering injection :: ${token.padEnd(40, ' ')} :: ${provider}`,
  );
};

export const registerInjection = <T>(
  token: string,
  provider: constructor<T> | ValueProvider<T>,
  options?: RegistrationOptions,
) => {
  if ((provider as ValueProvider<T>).useValue) {
    container.register<T>(token, provider as ValueProvider<T>);

    log(token, JSON.stringify((provider as ValueProvider<T>).useValue));

    return;
  }

  container.register<T>(token, provider as constructor<T>, options);

  log(token, (provider as constructor<T>).name);
};
