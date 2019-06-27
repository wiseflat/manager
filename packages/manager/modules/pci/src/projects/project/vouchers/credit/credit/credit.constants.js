export const MIN_QUANTITY = 1;

export const MAX_QUANTITY = 20000000;

export const DEFAULT_AMOUNT = 10;

export const ORDER = {
  planCode: 'credit',
  productId: 'cloud',
  pricingMode: 'default',
  configuration: [{
    label: 'type',
    value: 'public_cloud',
  }],
};

export const ORDER_URLS = {
  EU: {
    CZ: 'https://www.ovh.cz/order/express/#/express/review',
    DE: 'https://www.ovh.de/order/express/#/express/review',
    ES: 'https://www.ovh.es/order/express/#/express/review',
    FI: 'https://www.ovh-hosting.fi/order/express/#/express/review',
    FR: 'https://www.ovh.com/fr/order/express/#/express/review',
    GB: 'https://www.ovh.co.uk/order/express/#/express/review',
    IE: 'https://www.ovh.ie/order/express/#/express/review',
    IT: 'https://www.ovh.it/order/express/#/express/review',
    LT: 'https://www.ovh.lt/order/express/#/express/review',
    NL: 'https://www.ovh.nl/order/express/#/express/review',
    PL: 'https://www.ovh.pl/order/express/#/express/review',
    PT: 'https://www.ovh.pt/order/express/#/express/review',
    MA: 'https://www.ovh.ma/order/express/#/express/review',
    SN: 'https://www.ovh.sn/order/express/#/express/review',
    TN: 'https://www.ovh.com/tn/order/express/#/express/review',
  },
  CA: {
    ASIA: 'https://ca.ovh.com/asia/order/express/#/express/review',
    AU: 'https://ca.ovh.com/au/order/express/#/express/review',
    CA: 'https://ca.ovh.com/en/order/express/#/express/review',
    QC: 'https://ca.ovh.com/fr/order/express/#/express/review',
    SG: 'https://ca.ovh.com/sg/order/express/#/express/review',
    WE: 'https://us.ovh.com/us/order/express/#/express/review',
    WS: 'https://us.ovh.com/es/order/express/#/express/review',
  },
  US: {
    US: 'https://us.ovhcloud.com/order/express/#/express/review',
  },
};

export default {
  MIN_QUANTITY,
  MAX_QUANTITY,
  DEFAULT_AMOUNT,
  ORDER,
  ORDER_URLS,
};
