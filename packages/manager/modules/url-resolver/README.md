# manager-url-resolver

> Help to build external url based on OVHcloud manager manifest

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-url-resolver)](https://www.npmjs.com/package/@ovh-ux/manager-url-resolver) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-url-resolver)](https://npmjs.com/package/@ovh-ux/manager-url-resolver) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/url-resolver)](https://npmjs.com/package/@ovh-ux/manager-url-resolver?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/config)](https://npmjs.com/package/@ovh-ux/manager-url-resolver?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)


The url resolver use manifest generated with [manager-manifest-generator](https://github.com/ovh/manager/tree/master/packages/manager/tools/manifest-generator) and exposed in base urls.

For now, it only supports [@uirouter/core](https://www.npmjs.com/package/@uirouter/core) url format.

## Install

```sh
yarn add @ovh-ux/manager-url-resolver
```

## Usage


Define base urls (optionnal, base urls could be defined per resolve)

```js
import urlResolver from '@ovh-ux/manager-url-resolver';

urlResolver.setbaseUrls({
  applicationA: 'https://a.appurl.tld/',
  applicationB: 'https://b.appurl.tld/',
});
```

Resolve the `route` url from the `applicationA` manifest:

```js
urlResolver.resolve('applicationA', 'route').then((url) => {
  console.log(url);
});
```

Resolve the `route` url from the `applicationA` manifest with route parameters:

```js
urlResolver
  .resolve('applicationA', 'route', { paramA: 'valueA' })
  .then((url) => {
    console.log(url);
  });
```

Define/overwrite base url only for this resolve:

```js
urlResolver
  .resolve(
    'applicationA',
    'route',
    { paramA: 'valueA' },
    { applicationA: 'https://another.appurl.tld' },
  )
  .then((url) => {
    console.log(url);
  });
```

Resolve multiple routes (using an array)
```js
urlResolver
  .resolveAll([
    {
      application: 'applicationA',
      route: 'route',
      routeParams: { q: 'search' },
    },
    {
      application: 'applicationB',
      route: 'index',
      routeParams: { expand: 'all' },
    },
  ])
  .then(([urlA, urlB]) => {
    console.log(urlA, urlB);
  });
```

Resolve multiple routes (using an object)
```js
urlResolver
  .resolveAll({
    urlA: {
      application: 'applicationA',
      route: 'route',
      routeParams: { q: 'search' },
    },
    urlB: {
      application: 'applicationB',
      route: 'index',
      routeParams: { expand: 'all' },
    },
  })
  .then(({ urlA, urlB }) => {
    console.log(urlA, urlB);
  });
```

Define/overwrite base urls for theses resolves only:

```js
urlResolver
  .resolveAll(
    {
      urlA: {
        application: 'applicationA',
        route: 'route',
        routeParams: { q: 'search' },
      },
      urlB: {
        application: 'applicationB',
        route: 'index',
        routeParams: { expand: 'all' },
      },
    },
    { applicationA: 'https://another.appurl.tld' },
  )
  .then(({ urlA, urlB }) => {
    console.log(urlA, urlB);
  });
```

## Build

```sh
# Build in production mode
yarn start
```

## Development

If you want to contribute to the project, follow theses instructions:

Foremost, you should launch a global installation at the root folder of this repository:

```sh
yarn install
```

Then you just have to start the project in development mode. For this, two choices are possible according to your needs:

```sh
# Build the `manager-core` workspace and all the nested workspaces in development mode and watch only `manager-core` workspace
yarn start:dev
# Build and watch the `manager-core` workspace and all the nested workspaces in development mode
yarn start:watch
```

## Related

* [manager-manifest-generator](https://github.com/ovh/manager/tree/master/packages/manager/tools/manifest-generator) - OVHcloud Manager Manifest Generator.

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
