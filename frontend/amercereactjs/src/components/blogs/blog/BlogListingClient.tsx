import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useBlogs } from "@/hooks/useApi";
import { ShopPagination } from "@/components/shop/shop-default/ShopListingUi";
import { computePageItems } from "@/components/shop/shop-default/shopLayoutUtils";

const ITEMS_PER_PAGE = 6;

const PLACEHOLDER = "/frontend/assets/images/blog/img-blog-1.jpg";

export default function BlogListingClient() {
  const { blogs, loading } = useBlogs();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(blogs.length / ITEMS_PER_PAGE));

  const pageItems = useMemo(
    () => computePageItems(totalPages, currentPage),
    [totalPages, currentPage],
  );

  const visible = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return blogs.slice(start, start + ITEMS_PER_PAGE);
  }, [blogs, currentPage]);

  if (loading) {
    return (
      <div className="tf-grid-layout sm-col-2">
        {[...Array(6)].map((_, i) => (
          <article key={i} className="article-blog">
            <div className="blog-image img-style bg-light" style={{ height: 220 }} />
            <div className="blog-content mt-3">
              <div className="bg-light rounded mb-2" style={{ height: 14, width: "40%" }} />
              <div className="bg-light rounded mb-2" style={{ height: 20, width: "80%" }} />
              <div className="bg-light rounded" style={{ height: 14, width: "60%" }} />
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (!blogs.length) {
    return <p className="text-muted py-4">No blog posts yet. Check back soon!</p>;
  }

  return (
    <div className="tf-grid-layout sm-col-2">
      {visible.map((post) => (
        <article key={post.id} className="article-blog hover-img">
          <Link to={`/blog-single/${post.slug}`} className="blog-image img-style">
            <img
              loading="lazy"
              width={450}
              height={307}
              src={post.image_url || PLACEHOLDER}
              alt={post.title}
            />
          </Link>
          <div className="blog-content">
            <p className="entry-date text-caption-01 fw-semibold cl-text-3">{post.date}</p>
            <h5 className="entry-title">
              <Link to={`/blog-single/${post.slug}`} className="link-underline link">
                {post.title}
              </Link>
            </h5>
            <p className="entry-desc cl-text-2">{post.excerpt}</p>
          </div>
        </article>
      ))}
      {totalPages > 1 ? (
        <div className="wd-full">
          <ShopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageItems={pageItems}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : null}
    </div>
  );
}
