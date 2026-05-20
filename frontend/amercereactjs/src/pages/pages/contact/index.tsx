import PageTitle from "@/components/pages/contact/PageTitle";
import Map from "@/components/pages/contact/Map";
import Contact from "@/components/pages/contact/Contact";
import PageMeta from "@/components/common/PageMeta";

const ContactPage = () => {
  return (
    <>
      <PageMeta
        title={"Contact Us | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
        description={"Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
      />
      <PageTitle />
      <Map />
      <Contact />
    </>
  );
};

export default ContactPage;
