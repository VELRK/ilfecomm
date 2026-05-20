import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountOrders from "@/components/account/account-orders/AccountOrders";
import PageMeta from "@/components/common/PageMeta";

const AccountOrdersPage = () => {
  return (
    <>
      <PageMeta
        title={"Your Orders | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
        description={"Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
      />
      <AccountPageTitle />
      <AccountOrders />
    </>
  );
};

export default AccountOrdersPage;
