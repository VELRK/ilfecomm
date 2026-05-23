import { Link } from "react-router-dom";
import { useWishlistStore } from "@/store/wishlistStore";
import type { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";

function WishlistTableRow({
  product,
  removeFromWishlist,
}: {
  product: ProductCardItem;
  removeFromWishlist: (id: string | number) => void;
}) {
  const imgSrc =
    product.img || "/ilf/frontend/assets/images/product/product-1.jpg";

  return (
    <tr className="tf-cart_item each-prd file-delete">
      <td className="cart_product">
        <Link to={`/product-detail/${product.id}`} className="img-prd">
          <img loading="lazy" width={100} height={133} src={imgSrc} alt={product.name} />
        </Link>
        <div className="infor-prd">
          <Link
            to={`/product-detail/${product.id}`}
            className="prd_name fw-medium link lh-24"
          >
            {product.name}
          </Link>
          <div className="star-wrap d-flex align-items-center mt-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="icon icon-Star" style={{ fontSize: "12px", color: "#fca120", marginRight: "2px" }} />
            ))}
          </div>
          <button
            type="button"
            className="cart_remove tf-btn-line-3 type-primary remove border-0 bg-transparent p-0"
            onClick={() => removeFromWishlist(product.id)}
          >
            <span className="text-caption-01 fw-semibold">Remove</span>
          </button>
        </div>
      </td>
      <td
        className="cart_price each-price fw-semibold"
        data-cart-title="Price"
      >
        <div className="d-flex flex-column">
          <span className="price-new text-primary fw-semibold">{formatPrice(product.price)}</span>
          {product.priceOld && (
            <span className="price-old text-caption-01 cl-text-3 text-decoration-line-through">
              {formatPrice(product.priceOld)}
            </span>
          )}
        </div>
      </td>
      <td className="cart_stock" data-cart-title="Stock Status">
        <div className="stock-status text-success fw-medium">
          In Stock
        </div>
      </td>
      <td className="cart_action text-end">
        <a
          href="#quickAdd"
          data-bs-toggle="modal"
          className="tf-btn animate-btn"
        >
          Add to Cart
        </a>
      </td>
    </tr>
  );
}

function Wishlist() {
  const { items, toggle, loading } = useWishlistStore();
  const removeFromWishlist = (id: string | number) => {
    const product = items.find((p) => p.id === id);
    if (product) toggle(product);
  };

  return (
    <>
      <div className="section-wishlist flat-spacing-2">
        <div className="container">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-secondary" role="status" />
            </div>
          ) : items && items.length > 0 ? (
            <div className="row">
              <div className="col-12">
                <div className="overflow-auto">
                  <table className="tf-table-page-cart">
                    <thead>
                      <tr>
                        <th>
                          <p className="h6 fw-medium">Products</p>
                        </th>
                        <th>
                          <p className="h6 fw-medium">Price</p>
                        </th>
                        <th>
                          <p className="h6 fw-medium">Stock Status</p>
                        </th>
                        <th className="text-end">
                          <p className="h6 fw-medium">Actions</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((product) => (
                        <WishlistTableRow
                          key={product.id}
                          product={product as ProductCardItem}
                          removeFromWishlist={removeFromWishlist}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <h3 className="mb-3">Your wishlist is empty</h3>
              <p className="mb-4 text-secondary">
                You haven't added any products to your wishlist yet.
              </p>
              <Link to="/shop-default" className="tf-btn btn-primary animate-btn">
                Return to Shop
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Wishlist;
