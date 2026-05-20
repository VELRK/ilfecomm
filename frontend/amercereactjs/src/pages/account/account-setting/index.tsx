import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountSetting from "@/components/account/account-setting/AccountSetting";
import PageMeta from "@/components/common/PageMeta";

const AccountSettingPage = () => {
  return (
    <>
      <PageMeta
        title={"Setting | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
        description={"Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
      />
      <AccountPageTitle />
      <AccountSetting />
    </>
  );
};

export default AccountSettingPage;
