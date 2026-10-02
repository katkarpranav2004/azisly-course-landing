import type { AudienceContent } from "@/content/types";

/**
 * Starts enrolment: sends the visitor to the audience's hosted payment form when one is configured,
 * otherwise opens the on-site form. Same tab on purpose, so a payment app can return to the form.
 */
export function startEnroll(content: Pick<AudienceContent, "paymentUrl">, openForm: () => void) {
  if (content.paymentUrl) {
    window.location.assign(content.paymentUrl);
    return;
  }
  openForm();
}
