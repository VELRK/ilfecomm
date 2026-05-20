import PageTitle from "@/components/pages/about/PageTitle";
import MainAbout from "@/components/pages/about/MainAbout";
import BannerWhyChoose from "@/components/pages/about/BannerWhyChoose";
import Testimonial from "@/components/pages/about/Testimonial";
import Member from "@/components/pages/about/Member";
import PageMeta from "@/components/common/PageMeta";

const AboutPage = () => {
  return (
    <>
      <PageMeta
        title={"About Us | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
        description={"Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
      />
      <PageTitle />
      <MainAbout />
      <BannerWhyChoose />
      <Testimonial />
      <Member />
    </>
  );
};

export default AboutPage;
