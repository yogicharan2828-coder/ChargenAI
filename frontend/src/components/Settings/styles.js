export const styles = {
  page: {
    padding: "32px",
    color: "#ffffff",
    maxWidth: "760px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  pageTitle: {
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    marginBottom: "6px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#a1a1aa",
    marginBottom: "30px",
  },

  // ---- Section ----
  section: {
    marginBottom: "26px",
  },
  sectionCard: {
    background: "rgba(255,255,255,0.035)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#a1a1aa",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    padding: "16px 20px 10px",
  },

  // ---- Row ----
  row: (hovered, clickable) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    padding: "14px 20px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: hovered ? "rgba(255,255,255,0.045)" : "transparent",
    border: hovered
      ? "1px solid rgba(139,92,246,0.35)"
      : "1px solid transparent",
    borderRadius: "12px",
    margin: "0 8px",
    cursor: clickable ? "pointer" : "default",
    transition: "background 0.2s ease, border-color 0.2s ease",
    flexWrap: "wrap",
  }),
  rowLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },
  rowIcon: {
    fontSize: "18px",
    flexShrink: 0,
    width: "26px",
    textAlign: "center",
  },
  rowLabel: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#f4f4f5",
  },
  rowDescription: {
    fontSize: "12px",
    color: "#a1a1aa",
    marginTop: "2px",
  },
  rowRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },

  // ---- Appearance selection indicator ----
  selectedBadge: (selected) => ({
    fontSize: "12px",
    fontWeight: 600,
    color: selected ? "#c7d2fe" : "#71717a",
    background: selected ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.05)",
    border: selected
      ? "1px solid rgba(99,102,241,0.4)"
      : "1px solid rgba(255,255,255,0.1)",
    borderRadius: "999px",
    padding: "5px 12px",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  }),

  // ---- Toggle switch ----
  toggleTrack: (on) => ({
    width: "44px",
    height: "26px",
    borderRadius: "999px",
    background: on
      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
      : "rgba(255,255,255,0.12)",
    border: on
      ? "1px solid rgba(139,92,246,0.5)"
      : "1px solid rgba(255,255,255,0.15)",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.25s ease, border-color 0.25s ease",
    flexShrink: 0,
  }),
  toggleThumb: (on) => ({
    position: "absolute",
    top: "2px",
    left: on ? "21px" : "2px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
    transition: "left 0.25s ease",
  }),

  // ---- Select dropdown ----
  select: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "9px",
    padding: "7px 12px",
    color: "#ffffff",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },

  // ---- Action buttons (Coming Soon rows) ----
  actionBtn: (hovered) => ({
    background: hovered
      ? "rgba(99,102,241,0.18)"
      : "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.3)",
    color: "#c7d2fe",
    borderRadius: "9px",
    padding: "7px 14px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s ease, transform 0.15s ease",
    transform: hovered ? "translateY(-1px)" : "translateY(0)",
    whiteSpace: "nowrap",
  }),
  logoutBtn: (hovered) => ({
    background: hovered ? "rgba(239,68,68,0.18)" : "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
    borderRadius: "9px",
    padding: "7px 14px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s ease, transform 0.15s ease",
    transform: hovered ? "translateY(-1px)" : "translateY(0)",
    whiteSpace: "nowrap",
  }),

  // ---- About section ----
  aboutBlock: {
    padding: "18px 20px 20px",
  },
  aboutName: {
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "6px",
    letterSpacing: "-0.01em",
  },
  aboutText: {
    fontSize: "13px",
    color: "#a1a1aa",
    lineHeight: 1.6,
    marginBottom: "14px",
  },
  aboutMetaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  aboutTag: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#c7d2fe",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.28)",
    borderRadius: "999px",
    padding: "5px 12px",
  },

  // ---- Toast ----
  toastWrap: {
    position: "fixed",
    bottom: "28px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 2000,
    pointerEvents: "none",
  },
  toast: {
    background: "linear-gradient(180deg, rgba(32,32,44,0.95), rgba(17,17,25,0.96))",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(139,92,246,0.35)",
    borderRadius: "12px",
    padding: "12px 22px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#f4f4f5",
    boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
    whiteSpace: "nowrap",
  },
};