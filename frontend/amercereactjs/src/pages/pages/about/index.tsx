import PageTitle from "@/components/pages/about/PageTitle";
import AboutContent from "@/components/pages/about/AboutContent";
import PageMeta from "@/components/common/PageMeta";

const AboutPage = () => {
  return (
    <>
      <PageMeta
        title={"About Us | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
        description={"Welcome to Indian Ladies Fashion, Coimbatore's destination for elegant ethnic fashion, precision tailoring, and bespoke Aari embroidery."}
      />
      <PageTitle />
      <AboutContent />
    </>
  );
};

export default AboutPage;
