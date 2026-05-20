import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountDashboard from "@/components/account/account-page/AccountDashboard";
import PageMeta from "@/components/common/PageMeta";

const AccountPage = () => {
  return (
    <>
      <PageMeta
        title={"My Account | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
        description={"Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
      />
      <AccountPageTitle />
      <AccountDashboard />
    </>
  );
};

export default AccountPage;
