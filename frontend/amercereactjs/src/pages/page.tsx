import IndexPage from "./homes/home-fashion-2/index";
import MiniPopup from "@/components/modals/MiniPopup";
import { miniPopupProduct } from "@/data/products/products";
import PageMeta from "@/components/common/PageMeta";
export default function Page() {
  return (
    <>
      <PageMeta
        title="Index | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"
        description="Indian Ladies Fashion - Online Saree & Ethnic Wear Store"
      />
      <IndexPage />
      <MiniPopup product={miniPopupProduct} />
    </>
  );
}
