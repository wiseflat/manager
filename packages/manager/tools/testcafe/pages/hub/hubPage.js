import { Selector, t } from 'testcafe';
import ManagerParentPage from '../common/managerParent';

export default class HubPage extends ManagerParentPage {
  constructor() {
    super({ currentPageNameInUrl: 'manager/#/' });
    this.paymentStatusBlock = Selector('[data-navi-id="paymentStatus-block"]');
    this.ordersBlock = Selector('[data-navi-id="lastOrder-block"]');
    this.allOrdersList = this.ordersBlock.find(
      '[data-navi-id="lastOrder-go-to-orders"]',
    );
    this.helpBlock = Selector('[data-navi-id="help-block"]');
    this.helpLink = this.helpBlock.find(
      '[data-navi-id="helpBlock-link-to-guides"]',
    );
    this.totalBills = Selector('[data-navi-id="totalBills-block"]');
    this.linkToBills = this.totalBills.find(
      '[data-navi-id="totalBills-go-to-bills"]',
    );
    this.shortcuts = Selector(
      '[data-navi-id="account-sidebar-shortcuts-block"]',
    );
  }

  async goToRenewPage() {
    const goToRenewLink = this.paymentStatusBlock.child(2).find('a');
    await t.click(goToRenewLink);
  }

  async selectProductToRenew(product) {
    const productToSelect = this.paymentStatusBlock.find(
      `[data-navi-id="paymentStatus-${product}"]`,
    );
    const linkToRenew = Selector(
      `[data-navi-id="paymentStatus-${product}-dropdown"]`,
    );
    await t.expect(productToSelect.visible).ok();
    await t.click(linkToRenew);
  }

  async goToOrdersList() {
    await t.click(this.allOrdersList);
  }

  async goToDocs() {
    await t.expect(this.helpLink.visible).ok();
    await t.click(this.helpLink);
  }

  async goToBills() {
    await t.expect(this.linkToBills.visible).ok();
    await t.click(this.linkToBills);
  }

  async gotToProductsCatalog() {
    const catalogLink = this.shortcuts.find(
      '[data-track-name="hub::sidebar::shortcuts::go-to-catalog"]',
    );
    await t.expect(catalogLink.visible).ok();
    await t.click(catalogLink);
  }

  static async accessProductListDashboard(type) {
    const productBlock = Selector(`[data-navi-id="${type}-block"]`);
    const goToProductList = productBlock.find('button');
    await t.click(goToProductList);
  }
}
