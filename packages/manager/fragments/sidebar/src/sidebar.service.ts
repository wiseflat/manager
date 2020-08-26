import { groupBy } from 'lodash-es';
import { SidebarElement } from './model/SidebarElement';
import { Sidebar } from './model/Sidebar';
import { getConfig } from '@ovh-ux/manager-sidebar-config';
import { AppRoute } from './model/AppRoute';
import { ConfigItem } from './model/ConfigItem';
import { classToPlain } from 'class-transformer';

export const getItems = async (universe: string, routes: Array<AppRoute>, currentApp: string): Promise<Sidebar> => {
  const paths: string[] = [];
  const config: Array<ConfigItem> = (await getConfig(universe)).map((item: {label: string, app: string, url: string }) => new ConfigItem(item))

  const mapConfig = (config: Array<ConfigItem>, routes: Array<AppRoute>) : Array<ConfigItem> => config.map((element: ConfigItem) => {
    const route: ( AppRoute| undefined ) = routes.find(({ app }) => app === element.app)
    console.log(currentApp, element.app, universe)
    const item: any = ({
      ...classToPlain(element),
      ...route,
      // Allow relative path if we are in current app
      url: currentApp === element.app || currentApp === universe ? route?.url.replace(/^.*\/#/, '#') : route?.url
    })

    if (item.apiPath) {
      paths.push(item.apiPath)
    }

    if (element.subItems) {
      return new ConfigItem({
        ...item,
        subItems: mapConfig(element.subItems, routes)
      })
    }

    return new ConfigItem(item);
  });

  const elements = mapConfig(config, routes);
  const services = await getServices(paths);

  return new Sidebar(mapElements(elements, services));
}

export const mapElements = (config: Array<ConfigItem>, services: any) : SidebarElement[] => config.map((element: ConfigItem) => {
  const typedServices = element.apiPath ? services[element.apiPath]: null;
  const item = ({
    label: element.label,
    apiPath: element.apiPath,
    href: element.url,
    count: (typedServices && typedServices.length) || 0,
  })
  if (element.subItems) {
    return new SidebarElement({
      ...item,
      subItems: mapElements(element.subItems, services)
    })
  }

  return new SidebarElement(item)
})

export const getServices = async (paths: string[]) : Promise<object> => {
  let services = null;
  try {
    services = await (await fetch(`/engine/apiv6/services?routes=${paths.join(',')}`, {
      headers: new Headers({
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json',
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
      }),
      credentials: 'same-origin',
    })).json()
  }
  catch (error) {
    services = [];
  }

  return groupBy(services, (service: { route: any }) => service.route?.path.replace(/\/{.*/, ''))
}

export default {
  getServices,
  getItems,
};
