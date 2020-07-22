import config from '@ovh-ux/testcafe-manager/config';
import {
  userRole,
  userRoleDisconnect,
} from '@ovh-ux/testcafe-manager/roles/index';
import HubPage from '@ovh-ux/testcafe-manager/pages/hub/hubPage';
import AutoRenew from '@ovh-ux/testcafe-manager/pages/billing/autorenew';

const user = userRole(config);

fixture('check hub page')
  .meta({
    service: config.allowedServices(['ovh.com-manager', 'ca.ovh.com-manager']),
    type: 'regression',
    severity: 'critical',
    priority: 'high',
    scope: 'hub',
  })
  .beforeEach(async (t) => {
    await t.useRole(user);
  });

test(`go to ${config.dataset.hubProduct} renew page`, async () => {
  const hubPage = new HubPage();
  const autorenew = new AutoRenew();
  await hubPage.confirmCurrentPage();
  await hubPage.selectProductToRenew(config.dataset.hubProduct);
  await autorenew.confirmCurrentPage();
  await AutoRenew.confirmRenewUrlWithProductParameter(
    config.dataset.hubProduct,
  );
}).after(async () => {
  await userRoleDisconnect(config);
});
