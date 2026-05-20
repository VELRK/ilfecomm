import PageTitle from "@/components/pages/our-store/PageTitle";
import OurStore from "@/components/pages/our-store/OurStore";
import PageMeta from "@/components/common/PageMeta";

const OurStorePage = () => {
  return (
    <>
      <PageMeta
        title={"Our Store | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
        description={"Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
      />
      <PageTitle />
      <OurStore />
    </>
  );
};

export default OurStorePage;
