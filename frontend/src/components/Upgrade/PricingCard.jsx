import { useState } from "react";
import { styles } from "./styles";

function PricingCard({
  variant,
  name,
  price,
  period,
  badgeLabel,
  features,
  buttonLabel,
  isCurrentPlan,
  onUpgradeClick,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  return (
    <div
      style={styles.card(isHovered, variant)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {badgeLabel && (
        <span style={variant === "ultra" ? styles.ultraBadge : styles.badge}>
          {badgeLabel}
        </span>
      )}

      <div style={styles.planName}>{name}</div>

      <div style={styles.priceRow}>
        <span style={styles.priceValue}>{price}</span>
        {period && <span style={styles.pricePeriod}>{period}</span>}
      </div>

      <ul style={styles.featuresList}>
        {features.map((feature) => (
          <li style={styles.featureItem} key={feature}>
            <span style={styles.featureCheck}>✓</span>
            <span>{feature.replace(/^✓\s*/, "")}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <button style={styles.currentPlanBtn} disabled>
          {buttonLabel}
        </button>
      ) : (
        <button
          style={
            variant === "ultra"
              ? styles.upgradeBtnUltra(isBtnHovered)
              : styles.upgradeBtnPro(isBtnHovered)
          }
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          onClick={onUpgradeClick}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

export default PricingCard;