import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProduct } from "@/context/useProduct";
import { useContextElement } from "@/context/Context";
import type { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";
import { cartAPI } from "@/services/api";

const LOW_STOCK_THRESHOLD = 5;

export function ProductQuantityBuy({ product }: { product: ProductCardItem }) {
  const { quantity, setQuantity, currentColor, currentSize } = useProduct();
  const { addProductToCart, isAddedToCartProducts, updateQuantity } = useContextElement();
  const navigate = useNavigate();
  const isInCart = isAddedToCartProducts(product.id);
  const [adding, setAdding] = useState(false);

  const stock = Number(product.stock ?? 0);
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= LOW_STOCK_THRESHOLD;

  const selectedProduct = () => ({
    ...product,
    selectedColor: currentColor || undefined,
    selectedSize: currentSize || undefined,
  });

  const handleAddToCart = async () => {
    if (adding || isOutOfStock) return;
    setAdding(true);
    try {
      if (isInCart) {
        updateQuantity(product.id, quantity);
        cartAPI.update({ product_id: Number(product.id), quantity }).catch(() => {});
      } else {
        addProductToCart(selectedProduct(), quantity);
        cartAPI.add({ product_id: Number(product.id), quantity }).catch(() => {});
      }
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (adding || isOutOfStock) return;
    setAdding(true);
    try {
      if (!isInCart) {
        addProductToCart(selectedProduct(), quantity);
        await cartAPI.add({ product_id: Number(product.id), quantity }).catch(() => {});
      }
      navigate("/checkout");
    } finally {
      setAdding(false);
    }
  };

  if (isOutOfStock) {
    return (
      <div className="tf-product-total-quantity">
        <div className="mb-12">
          <span style={{ display: "inline-block", background: "#fee2e2", color: "#991b1b", fontWeight: 700, fontSize: 14, padding: "6px 16px", borderRadius: 6 }}>
            Out of Stock
          </span>
        </div>
        <p className="cl-text-2 small">This product is currently unavailable. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="tf-product-total-quantity">
      {/* Stock status badge */}
      {isLowStock ? (
        <div className="mb-12">
          <span style={{ display: "inline-block", background: "#fef3c7", color: "#92400e", fontWeight: 700, fontSize: 13, padding: "4px 12px", borderRadius: 6 }}>
            Only {stock} left — order soon!
          </span>
        </div>
      ) : (
        <div className="mb-12">
          <span style={{ display: "inline-block", background: "#dcfce7", color: "#166534", fontWeight: 600, fontSize: 13, padding: "4px 12px", borderRadius: 6 }}>
            In Stock ({stock} available)
          </span>
        </div>
      )}

      <p className="">Quantity:</p>
      <div className="group-action">
        <div className="wg-quantity">
          <button
            type="button"
            className="btn-quantity btn-decrease"
            disabled={quantity <= 1 || isOutOfStock}
            onClick={(e) => {
              e.preventDefault();
              setQuantity(Math.max(1, quantity - 1));
            }}
          >
            <i className="icon icon-minus" />
          </button>
          <input
            className="quantity-product"
            type="text"
            name="number"
            value={quantity}
            readOnly
          />
          <button
            type="button"
            className="btn-quantity btn-increase"
            disabled={isOutOfStock || quantity >= stock}
            onClick={(e) => {
              e.preventDefault();
              setQuantity(Math.min(stock, quantity + 1));
            }}
          >
            <i className="icon icon-plus" />
          </button>
        </div>
        <a
          href="#shoppingCart"
          data-bs-toggle={isOutOfStock ? undefined : "offcanvas"}
          className={`btn-action-price tf-btn type-xl animate-btn w-100${(adding || isOutOfStock) ? " disabled" : ""}`}
          style={isOutOfStock ? { opacity: 0.5, pointerEvents: "none", cursor: "not-allowed" } : undefined}
          onClick={(e) => { e.preventDefault(); handleAddToCart(); }}
          aria-disabled={isOutOfStock}
        >
          {isOutOfStock
            ? "Out of Stock"
            : adding
            ? "Adding…"
            : isInCart
            ? "Update Cart"
            : "Add To Cart"}
          {!isOutOfStock && (
            <>
              <span className="d-none d-sm-block d-md-none d-lg-block">&nbsp;-&nbsp;</span>
              <span className="price-add d-none d-sm-block d-md-none d-lg-block">
                {formatPrice(product.price * quantity)}
              </span>
            </>
          )}
        </a>
      </div>
      <button
        type="button"
        className="tf-btn type-xl btn-primary animate-btn w-100"
        disabled={adding || isOutOfStock}
        style={isOutOfStock ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
        onClick={handleBuyNow}
      >
        {isOutOfStock ? "Unavailable" : adding ? "Processing…" : "Buy It Now"}
      </button>
    </div>
  );
}
