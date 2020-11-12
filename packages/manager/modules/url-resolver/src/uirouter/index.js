import {
  UIRouter,
  MemoryLocationService,
  servicesPlugin,
} from '@uirouter/core';
import UrlLocationConfig from './UrlLocationConfig';

export const buildUrl = (
  pattern,
  params,
  { baseUrl, isHtml5Mode, hashPrefix },
) => {
  const router = new UIRouter(
    new MemoryLocationService(),
    new UrlLocationConfig(
      baseUrl || '',
      isHtml5Mode || false,
      hashPrefix || '',
    ),
  );

  router.plugin(servicesPlugin);

  /**
   * to avoid to register all states,
   * the manifest returns builded states url
   * So the state name should be a root state
   */
  router.stateRegistry.register({
    name: 'external',
    url: pattern,
  });

  return Promise.resolve(
    router.stateService.href('external', params, { absolute: true }),
  );
};

export default { buildUrl };
