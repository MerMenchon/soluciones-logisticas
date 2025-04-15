
// Type declaration for PrestaShop global variable
interface Customer {
  uid?: number;
  email?: string;
  siret?: number; // CUIT number
}

interface PrestaShop {
  customer?: Customer;
}

declare global {
  var prestashop: PrestaShop | undefined;
}

export {};
