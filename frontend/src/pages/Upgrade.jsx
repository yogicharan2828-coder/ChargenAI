import { useState, useRef, useEffect } from "react";
import PricingCard from "../components/Upgrade/PricingCard";
import { styles } from "../components/Upgrade/styles";

const MOBILE_BREAKPOINT = 768;

const PLANS = [
  {
    key: "free",
    variant: "free",
    name: "Free",
    price: "₹0",
    period: null,
    badgeLabel: null,
    isCurrentPlan: true,
    buttonLabel: "Current Plan",
    features: [
      "✓ AI Image Generation",
      "✓ Favorites",
      "✓ Projects",
      "✓ Standard Generation",
    ],
  },
  {
    key: "pro",
    variant: "pro",
    name: "Pro",
    price: "₹499",
    period: "/ month",
    badgeLabel: "Most Popular",
    isCurrentPlan: false,
    buttonLabel: "Upgrade to Pro",
    features: [
      "✓ Unlimited Generations",
      "✓ HD Image Generation",
      "✓ Image Editing",
      "✓ Faster Generation",
      "✓ Priority Features",
    ],
  },
  {
    key: "ultra",
    variant: "ultra",
    name: "Ultra",
    price: "₹999",
    period: "/ month",
    badgeLabel: null,
    isCurrentPlan: false,
    buttonLabel: "Upgrade to Ultra",
    features: [
      "✓ Everything in Pro",
      "✓ Advanced Image Editing",
      "✓ Premium AI Models",
      "✓ 4K Generation",
      "✓ Early Access Features",
    ],
  },
];

function Upgrade() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMounted, setToastMounted] = useState(false);
  const hideTimerRef = useRef(null);
  const unmountTimerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }

    window.addEventListener("resize", handleResize);
    // sync once in case viewport changed before this effect attached
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function showToast() {
    setToastMounted(true);
    // allow mount before triggering the transition
    requestAnimationFrame(() => setToastVisible(true));

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);

    hideTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      unmountTimerRef.current = setTimeout(() => {
        setToastMounted(false);
      }, 320);
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    };
  }, []);

  function handleUpgradeClick() {
    showToast();
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerBlock}>
        <h1 style={styles.headerTitle}>Upgrade Your Creative Experience</h1>
        <p style={styles.headerSubtitle}>
          Unlock more powerful AI tools and take your creations further.
        </p>
      </div>

      <div style={styles.cardsGrid(isMobile)}>
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.key}
            variant={plan.variant}
            name={plan.name}
            price={plan.price}
            period={plan.period}
            badgeLabel={plan.badgeLabel}
            features={plan.features}
            buttonLabel={plan.buttonLabel}
            isCurrentPlan={plan.isCurrentPlan}
            onUpgradeClick={handleUpgradeClick}
          />
        ))}
      </div>

      {toastMounted && (
        <div style={styles.toastWrap}>
          <div style={styles.toast(toastVisible)}>
            🚀 Feature is coming soon. Stay tuned!
          </div>
        </div>
      )}
    </div>
  );
}

export default Upgrade;