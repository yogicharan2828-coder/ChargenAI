import { styles } from "./styles";

function ProfileSkeleton() {
  return (
    <>
      <div style={styles.skeletonHeaderCard} />

      <div style={styles.skeletonStatsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div style={styles.skeletonStatCard} key={i} />
        ))}
      </div>

      <div style={styles.skeletonSectionGrid}>
        {[1, 2, 3].map((i) => (
          <div style={styles.skeletonCard} key={i} />
        ))}
      </div>

      <div style={styles.skeletonSectionGrid}>
        {[1, 2, 3].map((i) => (
          <div style={styles.skeletonCard} key={i} />
        ))}
      </div>
    </>
  );
}

export default ProfileSkeleton;