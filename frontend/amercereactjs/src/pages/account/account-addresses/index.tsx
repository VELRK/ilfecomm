import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountAddresses from "@/components/account/account-addresses/AccountAddresses";
import PageMeta from "@/components/common/PageMeta";

const AccountAddressesPage = () => {
  return (
    <>
      <PageMeta
        title={"My Address | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
        description={"Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
      />
      <AccountPageTitle />
      <AccountAddresses />
    </>
  );
};

export default AccountAddressesPage;
