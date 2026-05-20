import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import { useCategories } from "@/hooks/useApi";
import type { ApiCategory } from "@/services/api";

function catUrl(c: ApiCategory)  { return `/shop-default?category_id=${c.id}`; }
function subUrl(s: ApiCategory)  { return `/shop-default?subcategory_id=${s.id}`; }

export default function MobileMenu({
  registerOffcanvasElement,
}: {
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
}) {
  const navigate   = useNavigate();
  const elRef      = useRef<HTMLDivElement | null>(null);
  const { categories } = useCategories();

  const [search,   setSearch]   = useState("");
  const [openCats, setOpenCats] = useState<Set<number>>(new Set());

  // Imperatively hide the offcanvas, then navigate
  const closeAndGo = useCallback((path: string) => {
    const el = elRef.current;
    if (el) {
      import("bootstrap").then(({ Offcanvas }) => {
        Offcanvas.getInstance(el)?.hide();
      }).catch(() => {});
    }
    navigate(path);
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    closeAndGo(q ? `/shop-default?q=${encodeURIComponent(q)}` : "/shop-default");
    setSearch("");
  };

  const toggleCat = (id: number) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const refCb = useCallback((el: HTMLDivElement | null) => {
    elRef.current = el;
    registerOffcanvasElement?.(el);
  }, [registerOffcanvasElement]);

  return (
    <div ref={refCb} className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">

      {/* ── Header: close + search ── */}
      <div className="canvas-header">
        <span className="icon-close-popup" data-bs-dismiss="offcanvas" aria-label="Close menu">
          <i className="icon icon-X2" aria-hidden />
        </span>
        <form className="form-search-nav" onSubmit={handleSearch}>
          <fieldset>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </fieldset>
          <button type="submit" className="btn-action" aria-label="Search">
            <i className="icon icon-MagnifyingGlass" aria-hidden />
          </button>
        </form>
      </div>

      {/* ── Body: category tree ── */}
      <div className="canvas-body">
        <div className="mb-content-top">
          <ul className="nav-ul-mb" id="wrapper-menu-navigation">

            {categories.map((cat) => {
              const hasSub  = (cat.children?.length ?? 0) > 0;
              const isOpen  = openCats.has(cat.id);

              return (
                <li key={cat.id} className="nav-mb-item">
                  {hasSub ? (
                    <>
                      {/* Toggle row */}
                      <button
                        type="button"
                        className={`mb-menu-link w-100 d-flex align-items-center justify-content-between${isOpen ? "" : " collapsed"}`}
                        onClick={() => toggleCat(cat.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
                        aria-expanded={isOpen}
                      >
                        <span>{cat.name}</span>
                        <span
                          style={{
                            fontSize: 20, fontWeight: 400, lineHeight: 1,
                            color: "inherit", userSelect: "none",
                          }}
                          aria-hidden
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {/* Subcategory list */}
                      {isOpen && (
                        <ul className="sub-nav-menu">
                          <li>
                            <button
                              type="button"
                              className="sub-nav-link"
                              onClick={() => closeAndGo(catUrl(cat))}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%", textAlign: "left" }}
                            >
                              <span className="cus-text">View All {cat.name}</span>
                            </button>
                          </li>
                          {cat.children!.map((sub) => (
                            <li key={sub.id}>
                              <button
                                type="button"
                                className="sub-nav-link"
                                onClick={() => closeAndGo(subUrl(sub))}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%", textAlign: "left" }}
                              >
                                <span className="cus-text">{sub.name}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    /* Category with no subcategories — direct link */
                    <button
                      type="button"
                      className="mb-menu-link w-100"
                      onClick={() => closeAndGo(catUrl(cat))}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
                    >
                      <span>{cat.name}</span>
                    </button>
                  )}
                </li>
              );
            })}

          </ul>
        </div>

        <div className="need-help-wrap">
          <p className="nd-title h6 fw-medium mb-16">Need Help?</p>
          <a href="mailto:support@Indian Ladies Fashion.com" className="cl-text-2 link mb-8">
            support@Indian Ladies Fashion.com
          </a>
        </div>
      </div>
    </div>
  );
}
