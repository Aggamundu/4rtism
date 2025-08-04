import About from "./components/About";
import Banner from "./components/Banner";
import ProfileTabs from "./components/ProfileTabs";

export default function ProfilePage() {
  const aboutProps = {
    imageSrc: "/images/kai.png",
    displayName: "Kai",
    userName: "kai",
    bio: "I'm a software engineer"
  }
  return (
    <div>
      <Banner imageSrc={aboutProps.imageSrc} />
      <About imageSrc={aboutProps.imageSrc} displayName={aboutProps.displayName} userName={aboutProps.userName} bio={aboutProps.bio} />
      <ProfileTabs />
    </div>
  );
}