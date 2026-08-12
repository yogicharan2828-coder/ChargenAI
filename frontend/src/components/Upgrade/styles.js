export const styles = {
  page: {
    padding: "48px 32px",
    color: "#ffffff",
    maxWidth: "1080px",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  // ---- Header ----
  headerBlock: {
    textAlign: "center",
    marginBottom: "48px",
  },
  headerTitle: {
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #ffffff, #c7d2fe)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  headerSubtitle: {
    fontSize: "15px",
    color: "#a1a1aa",
    maxWidth: "480px",
    margin: "0 auto",
    lineHeight: 1.6,
  },

  // ---- Grid ----
  cardsGrid: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: "26px",
    alignItems: "stretch",
  }),

  // ---- Card ----
  card: (hovered, variant) => {
    const base = {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      borderRadius: "22px",
      padding: "32px 26px",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      transition:
        "border-color 0.28s ease, transform 0.28s ease, box-shadow 0.28s ease, background 0.28s ease",
      transform: hovered ? "translateY(-6px) scale(1.015)" : "translateY(0) scale(1)",
      cursor: "default",
    };

    if (variant === "pro") {
      return {
        ...base,
        background: hovered
          ? "linear-gradient(180deg, rgba(99,102,241,0.16), rgba(139,92,246,0.09))"
          : "linear-gradient(180deg, rgba(99,102,241,0.11), rgba(139,92,246,0.05))",
        border: hovered
          ? "1px solid rgba(139,92,246,0.65)"
          : "1px solid rgba(139,92,246,0.4)",
        boxShadow: hovered
          ? "0 22px 48px rgba(99,102,241,0.32)"
          : "0 10px 30px rgba(99,102,241,0.18)",
      };
    }

    if (variant === "ultra") {
      return {
        ...base,
        background: hovered
          ? "linear-gradient(180deg, rgba(255,255,255,0.065), rgba(255,255,255,0.03))"
          : "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02))",
        border: hovered
          ? "1px solid rgba(250,204,21,0.45)"
          : "1px solid rgba(250,204,21,0.22)",
        boxShadow: hovered
          ? "0 22px 48px rgba(250,204,21,0.16)"
          : "0 10px 30px rgba(0,0,0,0.22)",
      };
    }

    // free
    return {
      ...base,
      background: hovered
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.035)",
      border: hovered
        ? "1px solid rgba(255,255,255,0.18)"
        : "1px solid rgba(255,255,255,0.08)",
      boxShadow: hovered
        ? "0 16px 36px rgba(0,0,0,0.28)"
        : "0 4px 14px rgba(0,0,0,0.18)",
    };
  },

  badge: {
    position: "absolute",
    top: "-13px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    padding: "6px 16px",
    borderRadius: "999px",
    boxShadow: "0 6px 18px rgba(99,102,241,0.45)",
    whiteSpace: "nowrap",
  },

  ultraBadge: {
    position: "absolute",
    top: "-13px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #f59e0b, #facc15)",
    color: "#1c1917",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    padding: "6px 16px",
    borderRadius: "999px",
    boxShadow: "0 6px 18px rgba(250,204,21,0.4)",
    whiteSpace: "nowrap",
  },

  planName: {
    fontSize: "19px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    marginBottom: "6px",
  },

  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "6px",
    marginBottom: "22px",
  },
  priceValue: {
    fontSize: "30px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  pricePeriod: {
    fontSize: "13px",
    color: "#a1a1aa",
    fontWeight: 500,
  },

  featuresList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    marginBottom: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flexGrow: 1,
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "13.5px",
    color: "#d1d5db",
    lineHeight: 1.5,
  },
  featureCheck: {
    color: "#8b5cf6",
    fontWeight: 700,
    flexShrink: 0,
  },

  // ---- Buttons ----
  currentPlanBtn: {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#d1d5db",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "default",
    textAlign: "center",
  },

  upgradeBtnPro: (hovered) => ({
    width: "100%",
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.22s ease, box-shadow 0.22s ease",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
    boxShadow: hovered
      ? "0 14px 32px rgba(99,102,241,0.5)"
      : "0 6px 18px rgba(99,102,241,0.32)",
  }),

  upgradeBtnUltra: (hovered) => ({
    width: "100%",
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #f59e0b, #facc15)",
    border: "none",
    color: "#1c1917",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.22s ease, box-shadow 0.22s ease",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
    boxShadow: hovered
      ? "0 14px 32px rgba(250,204,21,0.45)"
      : "0 6px 18px rgba(250,204,21,0.28)",
  }),

  // ---- Toast ----
  toastWrap: {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    zIndex: 2000,
    pointerEvents: "none",
  },
  toast: (visible) => ({
    background:
      "linear-gradient(180deg, rgba(32,32,44,0.95), rgba(17,17,25,0.96))",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(139,92,246,0.4)",
    borderRadius: "14px",
    padding: "14px 22px",
    fontSize: "13.5px",
    fontWeight: 500,
    color: "#f4f4f5",
    boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 24px rgba(139,92,246,0.15)",
    whiteSpace: "nowrap",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  }),
};