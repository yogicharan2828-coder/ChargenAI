import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getProfile } from "../api/ai";
import { styles } from "../components/Profile/styles";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileStats from "../components/Profile/ProfileStats";
import RecentImages from "../components/Profile/RecentImages";
import RecentProjects from "../components/Profile/RecentProjects";
import ProfileSkeleton from "../components/Profile/ProfileSkeleton";
import "../components/Profile/profile.css";

// Google/GitHub/email-password users don't share one metadata shape,
// so try the common cases in order before falling back.
function getDisplayName(user) {
  if (!user) return "User";

  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    (user.email ? user.email.split("@")[0] : null) ||
    "User"
  );
}

function Profile() {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth to resolve before deciding whether to fetch.
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProfile();

        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  /* -----------------------------------------
     Loading State
     ----------------------------------------- */
  if (authLoading || loading) {
    return (
      <div className="profile-page" style={styles.page}>
        <ProfileSkeleton />
      </div>
    );
  }

  /* -----------------------------------------
     Not Logged In
     ----------------------------------------- */
  if (!user) {
    return (
      <div className="profile-page" style={styles.page}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIconBadge}>🔒</div>

          <div style={styles.emptyTitle}>
            You're not logged in
          </div>

          <div style={styles.emptyText}>
            Please log in to view your profile.
          </div>
        </div>
      </div>
    );
  }

  /* -----------------------------------------
     Error State
     ----------------------------------------- */
  if (error) {
    return (
      <div className="profile-page" style={styles.page}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIconBadge}>⚠️</div>

          <div style={styles.emptyTitle}>
            Couldn't load profile
          </div>

          <div style={styles.emptyText}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  /* -----------------------------------------
     Profile
     ----------------------------------------- */
  return (
    <div className="profile-page" style={styles.page}>
      <ProfileHeader
        name={getDisplayName(user)}
        email={user.email}
        subtitle="AI Creator"
        membership="Free Plan"
      />

      <ProfileStats
        imagesGenerated={profile?.images_generated}
        favoritesCount={profile?.favorites}
        projectsCount={profile?.projects}
        memberSince={profile?.member_since}
      />

      <RecentImages
        images={profile?.recent_images}
      />

      <RecentProjects
        projects={profile?.recent_projects}
      />
    </div>
  );
}

export default Profile;