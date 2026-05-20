import { Link, Navigate, useParams } from "react-router-dom";

import PageMeta from "@/components/common/PageMeta";
import PageTileSingle from "@/components/blogs/blog-single/PageTileSingle";
import { useBlog, useBlogs } from "@/hooks/useApi";

const siteName = "Indian Ladies Fashion - Online Saree & Ethnic Wear Store";

export default function BlogSingleDynamicPage() {
  const { id: slug = "" } = useParams<{ id: string }>();
  const { blog, loading, error } = useBlog(slug);
  const { blogs } = useBlogs();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error || !blog) return <Navigate to="/404" replace />;

  const currentIndex = blogs.findIndex((b) => b.slug === slug);
  const prevPost = currentIndex > 0 ? blogs[currentIndex - 1] : null;
  const nextPost = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

  return (
    <>
      <PageMeta
        title={`${blog.title} | ${siteName}`}
        description={(blog.excerpt ?? blog.title).slice(0, 160)}
      />
      <PageTileSingle title={blog.title} prevId={prevPost?.slug} nextId={nextPost?.slug} />

      <section className="section-blog-single">
        <div className="main-blog-single">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                {blog.image_url && (
                  <div className="blog-image">
                    <img
                      loading="lazy"
                      width={1410}
                      style={{ maxHeight: "600px", objectFit: "cover" }}
                      height={600}
                      src={blog.image_url}
                      alt={blog.title}
                    />
                  </div>
                )}
              </div>
              <div className="col-lg-8 mx-auto">
                <div className="blog-content">
                  <div className="blog-heading">
                    {blog.tags && (
                      <div className="entry-tag fw-medium">{blog.tags.split(",")[0].trim()}</div>
                    )}
                    <h3 className="entry-title">{blog.title}</h3>
                    <div className="entry-meta">
                      <div className="meta-item meta-date">
                        <i className="icon icon-CalendarBlank" />
                        <span className="text-body-1">{blog.date}</span>
                      </div>
                      <div className="br-line type-vertical" />
                      <div className="meta-item meta-author">
                        <i className="icon icon-User" />
                        <span className="text-body-1">by {blog.author || "Admin"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid gap-12">
                    {blog.content
                      ? blog.content.split("\n\n").map((para, i) => (
                          <p key={i} className="text text-body-1">{para}</p>
                        ))
                      : <p className="text text-body-1">{blog.excerpt}</p>
                    }
                  </div>

                  {/* Tags */}
                  {blog.tags && (
                    <div className="tags d-flex flex-wrap gap-2 mt-4">
                      <span className="fw-medium">Tags:</span>
                      {blog.tags.split(",").map((tag) => (
                        <Link key={tag} to="/blog" className="tf-btn style-2 btn-sm">
                          {tag.trim()}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Prev / Next navigation */}
                  {(prevPost || nextPost) && (
                    <div className="blog-nav d-flex justify-content-between mt-5 pt-4 border-top">
                      {prevPost ? (
                        <Link to={`/blog-single/${prevPost.slug}`} className="link fw-medium">
                          <i className="icon icon-ArrowLeft me-1" /> {prevPost.title}
                        </Link>
                      ) : <span />}
                      {nextPost && (
                        <Link to={`/blog-single/${nextPost.slug}`} className="link fw-medium text-end">
                          {nextPost.title} <i className="icon icon-ArrowRight ms-1" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
