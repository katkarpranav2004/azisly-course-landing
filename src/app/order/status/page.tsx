import OrderStatusView from "@/components/OrderStatusView";
import ThemeShell from "@/components/ThemeShell";
import type { Audience, Theme } from "@/content/types";

const THEME: Record<Audience, Theme> = { college: "sunset", corporate: "studio", course: "studio" };

export default async function OrderStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; audience?: string }>;
}) {
  const params = await searchParams;
  const audience: Audience =
    params.audience === "corporate" || params.audience === "course" ? params.audience : "college";

  return (
    <ThemeShell theme={THEME[audience]}>
      <OrderStatusView orderId={params.order_id ?? null} audience={audience} />
    </ThemeShell>
  );
}
