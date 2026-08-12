export const styles = {
  page: {
    padding: "32px",
    color: "#ffffff",
  },

  // ---- Header ----
  headerCard: (hovered) => ({
    background: "rgba(255,255,255,0.035)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: hovered
      ? "1px solid rgba(139,92,246,0.35)"
      : "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "28px 26px",
    marginBottom: "26px",
    display: "flex",
    alignItems: "center",
    gap: "22px",
    flexWrap: "wrap",
    transition: "border-color 0.28s ease, transform 0.28s ease, box-shadow 0.28s ease",
    transform: hovered ? "translateY(-3px)" : "translateY(0)",
    boxShadow: hovered
      ? "0 14px 34px rgba(99,102,241,0.18)"
      : "0 4px 14px rgba(0,0,0,0.18)",
  }),
  avatarCircle: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: 700,
    color: "#ffffff",
    flexShrink: 0,
    boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
  },
  headerTextBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  nameText: {
    fontSize: "24px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitleText: {
    fontSize: "14px",
    color: "#a1a1aa",
    margin: 0,
  },
  membershipBadge: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#c7d2fe",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.28)",
    borderRadius: "999px",
    padding: "5px 12px",
    display: "inline-block",
    width: "fit-content",
  },

  // ---- Stats ----
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "22px",
    marginBottom: "30px",
  },
  statCard: (hovered) => ({
    background: hovered
      ? "rgba(255,255,255,0.055)"
      : "rgba(255,255,255,0.035)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: hovered
      ? "1px solid rgba(139,92,246,0.5)"
      : "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    transition:
      "border-color 0.28s ease, transform 0.28s ease, box-shadow 0.28s ease, background 0.28s ease",
    transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
    boxShadow: hovered
      ? "0 16px 36px rgba(99,102,241,0.24)"
      : "0 4px 14px rgba(0,0,0,0.18)",
  }),
  statIconBadge: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  statTextBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: 0,
  },
  statValue: {
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  statLabel: {
    fontSize: "12px",
    color: "#a1a1aa",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },

  // ---- Section headers ----
  sectionTitle: {
    fontSize: "17px",
    fontWeight: 600,
    marginBottom: "16px",
    letterSpacing: "-0.01em",
  },
  section: {
    marginBottom: "34px",
  },

  // ---- Recent Images ----
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "22px",
  },
  imageCard: (hovered) => ({
    background: hovered
      ? "rgba(255,255,255,0.055)"
      : "rgba(255,255,255,0.035)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: hovered
      ? "1px solid rgba(139,92,246,0.5)"
      : "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transition:
      "border-color 0.28s ease, transform 0.28s ease, box-shadow 0.28s ease, background 0.28s ease",
    transform: hovered ? "translateY(-6px)" : "translateY(0)",
    boxShadow: hovered
      ? "0 16px 36px rgba(99,102,241,0.24)"
      : "0 4px 14px rgba(0,0,0,0.18)",
  }),
  imagePreviewWrap: {
    width: "100%",
    aspectRatio: "16 / 9",
    background: "rgba(0,0,0,0.3)",
    overflow: "hidden",
  },
  imagePreview: (hovered) => ({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease",
    transform: hovered ? "scale(1.05)" : "scale(1)",
  }),
  imageCardBody: {
    padding: "16px",
  },
  imagePrompt: {
    fontSize: "13px",
    color: "#d1d5db",
    lineHeight: 1.5,
    marginBottom: "10px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  imageCardDate: {
    fontSize: "12px",
    color: "#71717a",
    fontWeight: 500,
  },

  // ---- Recent Projects ----
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "22px",
  },
  projectCard: (hovered) => ({
    background: hovered
      ? "rgba(255,255,255,0.055)"
      : "rgba(255,255,255,0.035)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: hovered
      ? "1px solid rgba(139,92,246,0.5)"
      : "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "20px",
    cursor: "pointer",
    transition:
      "border-color 0.28s ease, transform 0.28s ease, box-shadow 0.28s ease, background 0.28s ease",
    transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
    boxShadow: hovered
      ? "0 16px 36px rgba(99,102,241,0.24)"
      : "0 4px 14px rgba(0,0,0,0.18)",
  }),
  projectCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  projectIconBadge: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },
  projectName: {
    fontSize: "15px",
    fontWeight: 600,
    margin: 0,
    wordBreak: "break-word",
  },
  projectDescription: {
    fontSize: "13px",
    color: "#a1a1aa",
    lineHeight: 1.5,
    marginBottom: "12px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  projectDate: {
    fontSize: "12px",
    color: "#71717a",
    fontWeight: 500,
  },

  // ---- Empty states ----
  emptyState: {
    textAlign: "center",
    padding: "60px 24px",
    background: "rgba(255,255,255,0.025)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px dashed rgba(255,255,255,0.14)",
    borderRadius: "20px",
  },
  emptyIconBadge: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    margin: "0 auto 14px",
  },
  emptyTitle: {
    fontSize: "15px",
    fontWeight: 600,
    marginBottom: "6px",
    letterSpacing: "-0.01em",
  },
  emptyText: {
    fontSize: "13px",
    color: "#a1a1aa",
    maxWidth: "320px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: 1.6,
  },

  // ---- Skeleton (loading) ----
  skeletonHeaderCard: {
    height: "140px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.07)",
    marginBottom: "26px",
  },
  skeletonStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "22px",
    marginBottom: "30px",
  },
  skeletonStatCard: {
    height: "76px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  skeletonSectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "22px",
    marginBottom: "34px",
  },
  skeletonCard: {
    height: "168px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
};