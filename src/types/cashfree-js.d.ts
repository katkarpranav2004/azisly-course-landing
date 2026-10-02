declare module "@cashfreepayments/cashfree-js" {
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_modal" | HTMLElement;
  }

  export interface Cashfree {
    checkout(options: CashfreeCheckoutOptions): Promise<unknown>;
  }

  export function load(options: {
    mode: "sandbox" | "production";
  }): Promise<Cashfree | null>;
}
