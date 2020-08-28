import { Environment } from '@ovh-ux/manager-config';
import toUpper from 'lodash/toUpper';

import { EXCLUDED_ROLES } from './constants';

export default class ManagerHubUserInfosCtrl {
  /* @ngInject */
  constructor(atInternet, RedirectionService, ssoAuthentication) {
    this.atInternet = atInternet;
    this.ssoAuthentication = ssoAuthentication;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.userAccountUrl = this.RedirectionService.getURL('userAccount');
    this.me = Environment.getUser();
    this.supportLevel = this.me.supportLevel;
    if (!EXCLUDED_ROLES.includes(this.me.method)) {
      this.role = this.me.method;
    }
  }

  getNameInitials() {
    return toUpper(`${this.me.firstname[0]}${this.me.name[0]}`);
  }

  getDisplayName() {
    return `${this.me.firstname} ${this.me.name}`;
  }

  logout() {
    this.atInternet.trackClick({
      name: 'hub::sidebar::profile::go-to-log-out',
      type: 'action',
    });
    return this.ssoAuthentication.logout();
  }
}
